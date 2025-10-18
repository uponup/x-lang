# 实践项目2：文件处理工具

## 项目概述

我们将创建一个功能强大的文件处理工具，支持文件搜索、内容替换、批量重命名、文件统计等功能。

## 项目结构

```
file_processor/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── search.rs
│   ├── replace.rs
│   ├── rename.rs
│   ├── stats.rs
│   └── utils.rs
└── README.md
```

## 创建项目

```bash
cargo new file_processor
cd file_processor
```

## 核心代码实现

### 1. Cargo.toml

```toml
[package]
name = "file_processor"
version = "0.1.0"
edition = "2021"
authors = ["Rust Learner <learner@example.com>"]
description = "一个功能强大的文件处理工具"

[dependencies]
clap = { version = "4.0", features = ["derive"] }
walkdir = "2.3"
regex = "1.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = { version = "0.4", features = ["serde"] }
```

### 2. src/lib.rs

```rust
pub mod search;
pub mod replace;
pub mod rename;
pub mod stats;
pub mod utils;

use std::path::PathBuf;
use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct FileInfo {
    pub path: PathBuf,
    pub size: u64,
    pub modified: std::time::SystemTime,
    pub is_file: bool,
    pub is_dir: bool,
}

#[derive(Debug)]
pub struct SearchOptions {
    pub pattern: String,
    pub case_sensitive: bool,
    pub recursive: bool,
    pub file_types: Vec<String>,
    pub exclude_dirs: Vec<String>,
}

impl Default for SearchOptions {
    fn default() -> Self {
        SearchOptions {
            pattern: String::new(),
            case_sensitive: false,
            recursive: true,
            file_types: Vec::new(),
            exclude_dirs: vec!["target".to_string(), ".git".to_string()],
        }
    }
}

#[derive(Debug)]
pub struct ReplaceOptions {
    pub search_pattern: String,
    pub replace_pattern: String,
    pub case_sensitive: bool,
    pub use_regex: bool,
    pub backup: bool,
    pub dry_run: bool,
}

impl Default for ReplaceOptions {
    fn default() -> Self {
        ReplaceOptions {
            search_pattern: String::new(),
            replace_pattern: String::new(),
            case_sensitive: false,
            use_regex: false,
            backup: true,
            dry_run: false,
        }
    }
}

pub struct FileProcessor {
    pub search_options: SearchOptions,
    pub replace_options: ReplaceOptions,
}

impl FileProcessor {
    pub fn new() -> FileProcessor {
        FileProcessor {
            search_options: SearchOptions::default(),
            replace_options: ReplaceOptions::default(),
        }
    }
    
    pub fn set_search_options(&mut self, options: SearchOptions) {
        self.search_options = options;
    }
    
    pub fn set_replace_options(&mut self, options: ReplaceOptions) {
        self.replace_options = options;
    }
}
```

### 3. src/search.rs

```rust
use crate::{FileInfo, SearchOptions};
use walkdir::WalkDir;
use std::path::Path;
use regex::Regex;

pub struct FileSearcher {
    options: SearchOptions,
}

impl FileSearcher {
    pub fn new(options: SearchOptions) -> FileSearcher {
        FileSearcher { options }
    }
    
    pub fn search(&self, root_path: &Path) -> Result<Vec<FileInfo>, String> {
        let mut results = Vec::new();
        
        let walker = WalkDir::new(root_path)
            .follow_links(false)
            .max_depth(if self.options.recursive { usize::MAX } else { 1 });
        
        for entry in walker {
            let entry = entry.map_err(|e| format!("遍历目录错误: {}", e))?;
            let path = entry.path();
            
            // 跳过排除的目录
            if self.should_exclude(path) {
                continue;
            }
            
            // 检查文件类型
            if !self.matches_file_type(path) {
                continue;
            }
            
            // 检查文件名是否匹配模式
            if self.matches_pattern(path) {
                let file_info = self.create_file_info(path)?;
                results.push(file_info);
            }
        }
        
        Ok(results)
    }
    
    fn should_exclude(&self, path: &Path) -> bool {
        if let Some(file_name) = path.file_name() {
            if let Some(name) = file_name.to_str() {
                return self.options.exclude_dirs.iter().any(|exclude| {
                    name.contains(exclude)
                });
            }
        }
        false
    }
    
    fn matches_file_type(&self, path: &Path) -> bool {
        if self.options.file_types.is_empty() {
            return true;
        }
        
        if let Some(extension) = path.extension() {
            if let Some(ext) = extension.to_str() {
                return self.options.file_types.iter().any(|ft| {
                    ft.trim_start_matches('.').eq_ignore_ascii_case(ext)
                });
            }
        }
        
        false
    }
    
    fn matches_pattern(&self, path: &Path) -> bool {
        if self.options.pattern.is_empty() {
            return true;
        }
        
        if let Some(file_name) = path.file_name() {
            if let Some(name) = file_name.to_str() {
                if self.options.case_sensitive {
                    return name.contains(&self.options.pattern);
                } else {
                    return name.to_lowercase().contains(&self.options.pattern.to_lowercase());
                }
            }
        }
        
        false
    }
    
    fn create_file_info(&self, path: &Path) -> Result<FileInfo, String> {
        let metadata = std::fs::metadata(path)
            .map_err(|e| format!("获取文件信息失败: {}", e))?;
        
        Ok(FileInfo {
            path: path.to_path_buf(),
            size: metadata.len(),
            modified: metadata.modified()
                .map_err(|e| format!("获取修改时间失败: {}", e))?,
            is_file: metadata.is_file(),
            is_dir: metadata.is_dir(),
        })
    }
}

pub fn search_files(root_path: &Path, options: SearchOptions) -> Result<Vec<FileInfo>, String> {
    let searcher = FileSearcher::new(options);
    searcher.search(root_path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;
    
    #[test]
    fn test_search_options() {
        let options = SearchOptions {
            pattern: "test".to_string(),
            case_sensitive: false,
            recursive: true,
            file_types: vec!["txt".to_string()],
            exclude_dirs: vec!["target".to_string()],
        };
        
        assert_eq!(options.pattern, "test");
        assert!(!options.case_sensitive);
        assert!(options.recursive);
    }
}
```

### 4. src/replace.rs

```rust
use crate::ReplaceOptions;
use std::path::Path;
use std::fs;
use regex::Regex;

pub struct FileReplacer {
    options: ReplaceOptions,
}

impl FileReplacer {
    pub fn new(options: ReplaceOptions) -> FileReplacer {
        FileReplacer { options }
    }
    
    pub fn replace_in_file(&self, file_path: &Path) -> Result<bool, String> {
        let content = fs::read_to_string(file_path)
            .map_err(|e| format!("读取文件失败: {}", e))?;
        
        let new_content = if self.options.use_regex {
            self.replace_with_regex(&content)?
        } else {
            self.replace_with_string(&content)
        };
        
        if new_content != content {
            if !self.options.dry_run {
                if self.options.backup {
                    self.create_backup(file_path)?;
                }
                
                fs::write(file_path, &new_content)
                    .map_err(|e| format!("写入文件失败: {}", e))?;
            }
            Ok(true)
        } else {
            Ok(false)
        }
    }
    
    fn replace_with_regex(&self, content: &str) -> Result<String, String> {
        let flags = if self.options.case_sensitive {
            regex::RegexBuilder::new(&self.options.search_pattern)
        } else {
            regex::RegexBuilder::new(&self.options.search_pattern)
        };
        
        let regex = flags
            .case_insensitive(!self.options.case_sensitive)
            .build()
            .map_err(|e| format!("正则表达式错误: {}", e))?;
        
        Ok(regex.replace_all(content, &self.options.replace_pattern).to_string())
    }
    
    fn replace_with_string(&self, content: &str) -> String {
        if self.options.case_sensitive {
            content.replace(&self.options.search_pattern, &self.options.replace_pattern)
        } else {
            // 简单的忽略大小写替换
            let mut result = content.to_string();
            let search_lower = self.options.search_pattern.to_lowercase();
            let replace = &self.options.replace_pattern;
            
            let mut start = 0;
            while let Some(pos) = result[start..].to_lowercase().find(&search_lower) {
                let actual_pos = start + pos;
                result.replace_range(actual_pos..actual_pos + self.options.search_pattern.len(), replace);
                start = actual_pos + replace.len();
            }
            
            result
        }
    }
    
    fn create_backup(&self, file_path: &Path) -> Result<(), String> {
        let backup_path = file_path.with_extension("bak");
        fs::copy(file_path, &backup_path)
            .map_err(|e| format!("创建备份失败: {}", e))?;
        Ok(())
    }
}

pub fn replace_in_files(file_paths: &[std::path::PathBuf], options: ReplaceOptions) -> Result<usize, String> {
    let replacer = FileReplacer::new(options);
    let mut replaced_count = 0;
    
    for file_path in file_paths {
        match replacer.replace_in_file(file_path) {
            Ok(true) => {
                replaced_count += 1;
                println!("已处理: {:?}", file_path);
            }
            Ok(false) => {
                println!("无需修改: {:?}", file_path);
            }
            Err(e) => {
                eprintln!("处理失败 {:?}: {}", file_path, e);
            }
        }
    }
    
    Ok(replaced_count)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;
    
    #[test]
    fn test_string_replace() {
        let options = ReplaceOptions {
            search_pattern: "hello".to_string(),
            replace_pattern: "hi".to_string(),
            case_sensitive: true,
            use_regex: false,
            backup: false,
            dry_run: true,
        };
        
        let replacer = FileReplacer::new(options);
        let content = "hello world hello";
        let result = replacer.replace_with_string(content);
        assert_eq!(result, "hi world hi");
    }
}
```

### 5. src/rename.rs

```rust
use std::path::{Path, PathBuf};
use std::fs;
use regex::Regex;

#[derive(Debug)]
pub struct RenameOptions {
    pub pattern: String,
    pub replacement: String,
    pub use_regex: bool,
    pub case_sensitive: bool,
    pub dry_run: bool,
    pub backup: bool,
}

impl Default for RenameOptions {
    fn default() -> Self {
        RenameOptions {
            pattern: String::new(),
            replacement: String::new(),
            use_regex: false,
            case_sensitive: true,
            dry_run: false,
            backup: true,
        }
    }
}

pub struct FileRenamer {
    options: RenameOptions,
}

impl FileRenamer {
    pub fn new(options: RenameOptions) -> FileRenamer {
        FileRenamer { options }
    }
    
    pub fn rename_file(&self, file_path: &Path) -> Result<Option<PathBuf>, String> {
        let file_name = file_path.file_name()
            .ok_or("无法获取文件名")?
            .to_str()
            .ok_or("文件名包含无效字符")?;
        
        let new_name = if self.options.use_regex {
            self.rename_with_regex(file_name)?
        } else {
            self.rename_with_string(file_name)
        };
        
        if new_name != file_name {
            let new_path = file_path.parent()
                .ok_or("无法获取父目录")?
                .join(&new_name);
            
            if !self.options.dry_run {
                if self.options.backup {
                    self.create_backup(file_path)?;
                }
                
                fs::rename(file_path, &new_path)
                    .map_err(|e| format!("重命名失败: {}", e))?;
            }
            
            Ok(Some(new_path))
        } else {
            Ok(None)
        }
    }
    
    fn rename_with_regex(&self, name: &str) -> Result<String, String> {
        let flags = if self.options.case_sensitive {
            regex::RegexBuilder::new(&self.options.pattern)
        } else {
            regex::RegexBuilder::new(&self.options.pattern)
        };
        
        let regex = flags
            .case_insensitive(!self.options.case_sensitive)
            .build()
            .map_err(|e| format!("正则表达式错误: {}", e))?;
        
        Ok(regex.replace_all(name, &self.options.replacement).to_string())
    }
    
    fn rename_with_string(&self, name: &str) -> String {
        if self.options.case_sensitive {
            name.replace(&self.options.pattern, &self.options.replacement)
        } else {
            // 简单的忽略大小写替换
            let mut result = name.to_string();
            let pattern_lower = self.options.pattern.to_lowercase();
            let replacement = &self.options.replacement;
            
            let mut start = 0;
            while let Some(pos) = result[start..].to_lowercase().find(&pattern_lower) {
                let actual_pos = start + pos;
                result.replace_range(actual_pos..actual_pos + self.options.pattern.len(), replacement);
                start = actual_pos + replacement.len();
            }
            
            result
        }
    }
    
    fn create_backup(&self, file_path: &Path) -> Result<(), String> {
        let backup_path = file_path.with_extension("bak");
        fs::copy(file_path, &backup_path)
            .map_err(|e| format!("创建备份失败: {}", e))?;
        Ok(())
    }
}

pub fn rename_files(file_paths: &[PathBuf], options: RenameOptions) -> Result<usize, String> {
    let renamer = FileRenamer::new(options);
    let mut renamed_count = 0;
    
    for file_path in file_paths {
        match renamer.rename_file(file_path) {
            Ok(Some(new_path)) => {
                renamed_count += 1;
                println!("重命名: {:?} -> {:?}", file_path, new_path);
            }
            Ok(None) => {
                println!("无需重命名: {:?}", file_path);
            }
            Err(e) => {
                eprintln!("重命名失败 {:?}: {}", file_path, e);
            }
        }
    }
    
    Ok(renamed_count)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;
    
    #[test]
    fn test_string_rename() {
        let options = RenameOptions {
            pattern: "old".to_string(),
            replacement: "new".to_string(),
            use_regex: false,
            case_sensitive: true,
            dry_run: true,
            backup: false,
        };
        
        let renamer = FileRenamer::new(options);
        let result = renamer.rename_with_string("old_file.txt");
        assert_eq!(result, "new_file.txt");
    }
}
```

### 6. src/stats.rs

```rust
use crate::FileInfo;
use std::collections::HashMap;
use std::path::Path;

#[derive(Debug)]
pub struct FileStats {
    pub total_files: usize,
    pub total_dirs: usize,
    pub total_size: u64,
    pub file_types: HashMap<String, FileTypeStats>,
    pub largest_file: Option<FileInfo>,
    pub smallest_file: Option<FileInfo>,
}

#[derive(Debug)]
pub struct FileTypeStats {
    pub count: usize,
    pub total_size: u64,
    pub extension: String,
}

impl FileStats {
    pub fn new() -> FileStats {
        FileStats {
            total_files: 0,
            total_dirs: 0,
            total_size: 0,
            file_types: HashMap::new(),
            largest_file: None,
            smallest_file: None,
        }
    }
    
    pub fn add_file(&mut self, file_info: &FileInfo) {
        if file_info.is_file {
            self.total_files += 1;
            self.total_size += file_info.size;
            
            // 更新最大和最小文件
            if let Some(ref mut largest) = self.largest_file {
                if file_info.size > largest.size {
                    *largest = file_info.clone();
                }
            } else {
                self.largest_file = Some(file_info.clone());
            }
            
            if let Some(ref mut smallest) = self.smallest_file {
                if file_info.size < smallest.size {
                    *smallest = file_info.clone();
                }
            } else {
                self.smallest_file = Some(file_info.clone());
            }
            
            // 统计文件类型
            if let Some(extension) = file_info.path.extension() {
                if let Some(ext) = extension.to_str() {
                    let ext = ext.to_lowercase();
                    let stats = self.file_types.entry(ext.clone()).or_insert(FileTypeStats {
                        count: 0,
                        total_size: 0,
                        extension: ext,
                    });
                    stats.count += 1;
                    stats.total_size += file_info.size;
                }
            }
        } else if file_info.is_dir {
            self.total_dirs += 1;
        }
    }
    
    pub fn print_summary(&self) {
        println!("文件统计摘要:");
        println!("  总文件数: {}", self.total_files);
        println!("  总目录数: {}", self.total_dirs);
        println!("  总大小: {} 字节 ({:.2} MB)", 
                self.total_size, 
                self.total_size as f64 / 1024.0 / 1024.0);
        
        if let Some(ref largest) = self.largest_file {
            println!("  最大文件: {:?} ({} 字节)", largest.path, largest.size);
        }
        
        if let Some(ref smallest) = self.smallest_file {
            println!("  最小文件: {:?} ({} 字节)", smallest.path, smallest.size);
        }
        
        if !self.file_types.is_empty() {
            println!("  文件类型统计:");
            let mut sorted_types: Vec<_> = self.file_types.iter().collect();
            sorted_types.sort_by(|a, b| b.1.count.cmp(&a.1.count));
            
            for (_, stats) in sorted_types.iter().take(10) {
                println!("    .{}: {} 个文件, {} 字节", 
                        stats.extension, 
                        stats.count, 
                        stats.total_size);
            }
        }
    }
}

pub fn calculate_stats(file_infos: &[FileInfo]) -> FileStats {
    let mut stats = FileStats::new();
    
    for file_info in file_infos {
        stats.add_file(file_info);
    }
    
    stats
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use std::time::SystemTime;
    
    #[test]
    fn test_file_stats() {
        let mut stats = FileStats::new();
        
        let file_info = FileInfo {
            path: PathBuf::from("test.txt"),
            size: 100,
            modified: SystemTime::now(),
            is_file: true,
            is_dir: false,
        };
        
        stats.add_file(&file_info);
        assert_eq!(stats.total_files, 1);
        assert_eq!(stats.total_size, 100);
    }
}
```

### 7. src/utils.rs

```rust
use std::path::Path;
use std::fs;
use chrono::{DateTime, Local};

pub fn format_file_size(size: u64) -> String {
    const UNITS: &[&str] = &["B", "KB", "MB", "GB", "TB"];
    let mut size = size as f64;
    let mut unit_index = 0;
    
    while size >= 1024.0 && unit_index < UNITS.len() - 1 {
        size /= 1024.0;
        unit_index += 1;
    }
    
    format!("{:.2} {}", size, UNITS[unit_index])
}

pub fn format_timestamp(timestamp: std::time::SystemTime) -> String {
    let datetime: DateTime<Local> = timestamp.into();
    datetime.format("%Y-%m-%d %H:%M:%S").to_string()
}

pub fn is_text_file(file_path: &Path) -> bool {
    if let Ok(content) = fs::read(file_path) {
        // 简单检查：如果文件包含null字节，则认为是二进制文件
        !content.contains(&0)
    } else {
        false
    }
}

pub fn get_file_extension(file_path: &Path) -> Option<String> {
    file_path.extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.to_lowercase())
}

pub fn create_directory_if_not_exists(path: &Path) -> Result<(), String> {
    if !path.exists() {
        fs::create_dir_all(path)
            .map_err(|e| format!("创建目录失败: {}", e))?;
    }
    Ok(())
}

pub fn copy_file_with_progress(src: &Path, dst: &Path) -> Result<u64, String> {
    fs::copy(src, dst)
        .map_err(|e| format!("复制文件失败: {}", e))
}

pub fn move_file_with_backup(src: &Path, dst: &Path) -> Result<(), String> {
    // 如果目标文件已存在，先创建备份
    if dst.exists() {
        let backup_path = dst.with_extension("bak");
        fs::rename(dst, &backup_path)
            .map_err(|e| format!("创建备份失败: {}", e))?;
    }
    
    fs::rename(src, dst)
        .map_err(|e| format!("移动文件失败: {}", e))?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;
    
    #[test]
    fn test_format_file_size() {
        assert_eq!(format_file_size(1024), "1.00 KB");
        assert_eq!(format_file_size(1048576), "1.00 MB");
        assert_eq!(format_file_size(512), "512.00 B");
    }
    
    #[test]
    fn test_get_file_extension() {
        let path = Path::new("test.txt");
        assert_eq!(get_file_extension(path), Some("txt".to_string()));
        
        let path = Path::new("test");
        assert_eq!(get_file_extension(path), None);
    }
}
```

### 8. src/main.rs

```rust
use clap::{Parser, Subcommand};
use file_processor::{
    search::search_files, 
    replace::replace_in_files, 
    rename::rename_files,
    stats::calculate_stats,
    SearchOptions, ReplaceOptions, RenameOptions
};
use std::path::Path;

#[derive(Parser)]
#[command(name = "file_processor")]
#[command(about = "一个功能强大的文件处理工具")]
#[command(version)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// 搜索文件
    Search {
        /// 搜索模式
        pattern: String,
        /// 搜索根目录
        #[arg(short, long, default_value = ".")]
        path: String,
        /// 递归搜索
        #[arg(short, long)]
        recursive: bool,
        /// 文件类型过滤
        #[arg(short, long)]
        file_type: Option<String>,
        /// 排除目录
        #[arg(long)]
        exclude: Vec<String>,
    },
    /// 替换文件内容
    Replace {
        /// 搜索模式
        pattern: String,
        /// 替换内容
        replacement: String,
        /// 文件路径
        file_path: String,
        /// 使用正则表达式
        #[arg(short, long)]
        regex: bool,
        /// 不实际修改文件
        #[arg(long)]
        dry_run: bool,
    },
    /// 重命名文件
    Rename {
        /// 搜索模式
        pattern: String,
        /// 替换内容
        replacement: String,
        /// 文件路径
        file_path: String,
        /// 使用正则表达式
        #[arg(short, long)]
        regex: bool,
        /// 不实际修改文件
        #[arg(long)]
        dry_run: bool,
    },
    /// 文件统计
    Stats {
        /// 统计路径
        #[arg(default_value = ".")]
        path: String,
    },
}

fn main() {
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Search { pattern, path, recursive, file_type, exclude } => {
            let search_options = SearchOptions {
                pattern,
                case_sensitive: false,
                recursive,
                file_types: file_type.map(|ft| vec![ft]).unwrap_or_default(),
                exclude_dirs: exclude,
            };
            
            match search_files(Path::new(&path), search_options) {
                Ok(files) => {
                    println!("找到 {} 个文件:", files.len());
                    for file in files {
                        println!("  {:?}", file.path);
                    }
                }
                Err(e) => eprintln!("搜索失败: {}", e),
            }
        }
        
        Commands::Replace { pattern, replacement, file_path, regex, dry_run } => {
            let replace_options = ReplaceOptions {
                search_pattern: pattern,
                replace_pattern: replacement,
                case_sensitive: false,
                use_regex: regex,
                backup: !dry_run,
                dry_run,
            };
            
            let file_paths = vec![std::path::PathBuf::from(file_path)];
            match replace_in_files(&file_paths, replace_options) {
                Ok(count) => println!("已处理 {} 个文件", count),
                Err(e) => eprintln!("替换失败: {}", e),
            }
        }
        
        Commands::Rename { pattern, replacement, file_path, regex, dry_run } => {
            let rename_options = RenameOptions {
                pattern,
                replacement,
                use_regex: regex,
                case_sensitive: true,
                dry_run,
                backup: !dry_run,
            };
            
            let file_paths = vec![std::path::PathBuf::from(file_path)];
            match rename_files(&file_paths, rename_options) {
                Ok(count) => println!("已重命名 {} 个文件", count),
                Err(e) => eprintln!("重命名失败: {}", e),
            }
        }
        
        Commands::Stats { path } => {
            let search_options = SearchOptions {
                pattern: String::new(),
                case_sensitive: false,
                recursive: true,
                file_types: Vec::new(),
                exclude_dirs: vec!["target".to_string(), ".git".to_string()],
            };
            
            match search_files(Path::new(&path), search_options) {
                Ok(files) => {
                    let stats = calculate_stats(&files);
                    stats.print_summary();
                }
                Err(e) => eprintln!("统计失败: {}", e),
            }
        }
    }
}
```

## 使用示例

### 搜索文件

```bash
# 搜索所有.txt文件
cargo run -- search "*.txt" --path ./src

# 递归搜索包含"test"的文件
cargo run -- search "test" --recursive

# 搜索特定类型的文件
cargo run -- search "config" --file-type json
```

### 替换内容

```bash
# 简单字符串替换
cargo run -- replace "old_text" "new_text" --file-path ./test.txt

# 使用正则表达式替换
cargo run -- replace "\\d+" "NUMBER" --file-path ./test.txt --regex

# 预览替换（不实际修改）
cargo run -- replace "old" "new" --file-path ./test.txt --dry-run
```

### 重命名文件

```bash
# 重命名文件
cargo run -- rename "old_name" "new_name" --file-path ./old_file.txt

# 使用正则表达式重命名
cargo run -- rename "file_(\\d+)" "document_$1" --file-path ./file_123.txt --regex
```

### 文件统计

```bash
# 统计当前目录
cargo run -- stats

# 统计指定目录
cargo run -- stats --path /path/to/directory
```

## 扩展功能

### 1. 添加文件监控

```rust
// 添加文件系统监控功能
use notify::{Watcher, RecursiveMode, watcher};
use std::sync::mpsc::channel;
use std::time::Duration;

pub fn watch_directory(path: &Path) -> Result<(), String> {
    let (tx, rx) = channel();
    let mut watcher = watcher(tx, Duration::from_secs(1))
        .map_err(|e| format!("创建监控器失败: {}", e))?;
    
    watcher.watch(path, RecursiveMode::Recursive)
        .map_err(|e| format!("监控目录失败: {}", e))?;
    
    loop {
        match rx.recv() {
            Ok(event) => println!("文件变化: {:?}", event),
            Err(e) => println!("监控错误: {:?}", e),
        }
    }
}
```

### 2. 添加文件压缩

```rust
// 添加文件压缩和解压功能
use flate2::write::GzEncoder;
use flate2::read::GzDecoder;
use std::io::{Read, Write};

pub fn compress_file(input_path: &Path, output_path: &Path) -> Result<(), String> {
    let mut input_file = std::fs::File::open(input_path)
        .map_err(|e| format!("打开文件失败: {}", e))?;
    
    let output_file = std::fs::File::create(output_path)
        .map_err(|e| format!("创建文件失败: {}", e))?;
    
    let mut encoder = GzEncoder::new(output_file, flate2::Compression::default());
    std::io::copy(&mut input_file, &mut encoder)
        .map_err(|e| format!("压缩失败: {}", e))?;
    
    encoder.finish()
        .map_err(|e| format!("完成压缩失败: {}", e))?;
    
    Ok(())
}
```

## 测试

```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_search_options

# 运行集成测试
cargo test --test integration_tests
```

## 下一步

现在您已经完成了一个功能强大的文件处理工具。接下来我们将学习如何创建一个简单的Web服务器项目。

