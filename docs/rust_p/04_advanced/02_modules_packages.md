# 模块和包管理

## 模块系统概述

Rust的模块系统包括：
- **包（Packages）**：Cargo功能，让你构建、测试和分享crate
- **Crate**：一个模块树，它产生一个library或可执行文件
- **模块（Modules）**：让你控制作用域和路径的私有性
- **路径（Paths）**：命名项的方式

## 包和Crate

### 创建包

```bash
# 创建二进制包
cargo new my_binary_package

# 创建库包
cargo new --lib my_library_package
```

### 包结构

```
my_package/
├── Cargo.toml          # 包配置文件
├── src/
│   ├── lib.rs          # 库根文件
│   ├── main.rs         # 二进制根文件
│   └── bin/            # 额外的二进制文件
│       └── another_binary.rs
└── tests/              # 集成测试
    └── integration_test.rs
```

## 模块基础

### 定义模块

```rust
// src/lib.rs
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("添加到等待列表");
        }
        
        fn seat_at_table() {
            println!("安排座位");
        }
    }
    
    mod serving {
        fn take_order() {
            println!("接受订单");
        }
        
        fn serve_order() {
            println!("上菜");
        }
        
        fn take_payment() {
            println!("收银");
        }
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();
    
    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}

fn main() {
    eat_at_restaurant();
}
```

### 模块的可见性

```rust
mod parent {
    pub mod child {
        pub fn public_function() {
            println!("这是公共函数");
        }
        
        fn private_function() {
            println!("这是私有函数");
        }
        
        pub fn indirect_access() {
            print!("通过间接访问调用: ");
            private_function();
        }
    }
}

fn main() {
    parent::child::public_function();
    parent::child::indirect_access();
    // parent::child::private_function(); // 错误！私有函数
}
```

## 使用use关键字

### 基本使用

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

// 使用use引入路径
use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}

fn main() {
    eat_at_restaurant();
}
```

### 重命名和重新导出

```rust
use std::collections::HashMap as Map;
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Map<String, i32> {
    Map::new()
}

fn function2() -> Result {
    Ok(())
}

fn function3() -> IoResult<()> {
    Ok(())
}

fn main() {
    let map = function1();
    println!("创建了HashMap: {:?}", map);
}
```

### 使用pub use重新导出

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {
            println!("添加到等待列表");
        }
    }
}

// 重新导出，让外部代码可以直接使用
pub use crate::front_of_house::hosting;

fn main() {
    // 现在可以直接使用hosting
    hosting::add_to_waitlist();
}
```

## 练习1：学生管理系统模块

```rust
// src/lib.rs
mod student {
    pub mod personal_info {
        #[derive(Debug)]
        pub struct PersonalInfo {
            pub name: String,
            pub age: u32,
            pub email: String,
        }
        
        impl PersonalInfo {
            pub fn new(name: String, age: u32, email: String) -> PersonalInfo {
                PersonalInfo { name, age, email }
            }
            
            pub fn display(&self) {
                println!("姓名: {}, 年龄: {}, 邮箱: {}", 
                        self.name, self.age, self.email);
            }
        }
    }
    
    pub mod academic {
        use super::personal_info::PersonalInfo;
        
        #[derive(Debug)]
        pub struct Student {
            pub personal: PersonalInfo,
            pub student_id: String,
            pub grade: f64,
        }
        
        impl Student {
            pub fn new(personal: PersonalInfo, student_id: String) -> Student {
                Student {
                    personal,
                    student_id,
                    grade: 0.0,
                }
            }
            
            pub fn update_grade(&mut self, new_grade: f64) {
                self.grade = new_grade;
            }
            
            pub fn get_grade_level(&self) -> String {
                match self.grade {
                    g if g >= 90.0 => "优秀".to_string(),
                    g if g >= 80.0 => "良好".to_string(),
                    g if g >= 70.0 => "中等".to_string(),
                    g if g >= 60.0 => "及格".to_string(),
                    _ => "不及格".to_string(),
                }
            }
        }
    }
    
    pub mod management {
        use super::academic::Student;
        use super::personal_info::PersonalInfo;
        use std::collections::HashMap;
        
        pub struct StudentManager {
            students: HashMap<String, Student>,
        }
        
        impl StudentManager {
            pub fn new() -> StudentManager {
                StudentManager {
                    students: HashMap::new(),
                }
            }
            
            pub fn add_student(&mut self, personal: PersonalInfo, student_id: String) {
                let student = Student::new(personal, student_id.clone());
                self.students.insert(student_id, student);
            }
            
            pub fn get_student(&self, student_id: &str) -> Option<&Student> {
                self.students.get(student_id)
            }
            
            pub fn update_student_grade(&mut self, student_id: &str, grade: f64) -> bool {
                if let Some(student) = self.students.get_mut(student_id) {
                    student.update_grade(grade);
                    true
                } else {
                    false
                }
            }
            
            pub fn list_all_students(&self) {
                println!("所有学生:");
                for (id, student) in &self.students {
                    println!("学号: {}", id);
                    student.personal.display();
                    println!("成绩: {:.1} ({})", student.grade, student.get_grade_level());
                    println!("---");
                }
            }
        }
    }
}

// 重新导出主要类型
pub use student::personal_info::PersonalInfo;
pub use student::academic::Student;
pub use student::management::StudentManager;

fn main() {
    let mut manager = StudentManager::new();
    
    // 添加学生
    let personal1 = PersonalInfo::new(
        "张三".to_string(),
        20,
        "zhangsan@example.com".to_string(),
    );
    manager.add_student(personal1, "2023001".to_string());
    
    let personal2 = PersonalInfo::new(
        "李四".to_string(),
        21,
        "lisi@example.com".to_string(),
    );
    manager.add_student(personal2, "2023002".to_string());
    
    // 更新成绩
    manager.update_student_grade("2023001", 85.5);
    manager.update_student_grade("2023002", 92.0);
    
    // 列出所有学生
    manager.list_all_students();
}
```

## 练习2：文件系统模拟

```rust
// src/lib.rs
mod filesystem {
    pub mod file {
        use std::collections::HashMap;
        
        #[derive(Debug, Clone)]
        pub struct File {
            pub name: String,
            pub size: u64,
            pub content: String,
            pub permissions: FilePermissions,
        }
        
        #[derive(Debug, Clone)]
        pub struct FilePermissions {
            pub readable: bool,
            pub writable: bool,
            pub executable: bool,
        }
        
        impl File {
            pub fn new(name: String, content: String) -> File {
                File {
                    name,
                    size: content.len() as u64,
                    content,
                    permissions: FilePermissions {
                        readable: true,
                        writable: true,
                        executable: false,
                    },
                }
            }
            
            pub fn read(&self) -> Result<&String, String> {
                if self.permissions.readable {
                    Ok(&self.content)
                } else {
                    Err("文件不可读".to_string())
                }
            }
            
            pub fn write(&mut self, content: String) -> Result<(), String> {
                if self.permissions.writable {
                    self.content = content;
                    self.size = self.content.len() as u64;
                    Ok(())
                } else {
                    Err("文件不可写".to_string())
                }
            }
        }
    }
    
    pub mod directory {
        use super::file::File;
        use std::collections::HashMap;
        
        #[derive(Debug)]
        pub struct Directory {
            pub name: String,
            pub files: HashMap<String, File>,
            pub subdirectories: HashMap<String, Directory>,
        }
        
        impl Directory {
            pub fn new(name: String) -> Directory {
                Directory {
                    name,
                    files: HashMap::new(),
                    subdirectories: HashMap::new(),
                }
            }
            
            pub fn add_file(&mut self, file: File) {
                let name = file.name.clone();
                self.files.insert(name, file);
            }
            
            pub fn create_subdirectory(&mut self, name: String) -> &mut Directory {
                let dir = Directory::new(name.clone());
                self.subdirectories.insert(name, dir);
                self.subdirectories.get_mut(&name).unwrap()
            }
            
            pub fn get_file(&self, name: &str) -> Option<&File> {
                self.files.get(name)
            }
            
            pub fn get_file_mut(&mut self, name: &str) -> Option<&mut File> {
                self.files.get_mut(name)
            }
            
            pub fn list_contents(&self) {
                println!("目录: {}", self.name);
                println!("文件:");
                for (name, file) in &self.files {
                    println!("  {} ({} 字节)", name, file.size);
                }
                println!("子目录:");
                for (name, _) in &self.subdirectories {
                    println!("  {}/", name);
                }
            }
            
            pub fn get_total_size(&self) -> u64 {
                let file_size: u64 = self.files.values().map(|f| f.size).sum();
                let dir_size: u64 = self.subdirectories.values().map(|d| d.get_total_size()).sum();
                file_size + dir_size
            }
        }
    }
    
    pub mod filesystem {
        use super::directory::Directory;
        use super::file::File;
        
        pub struct FileSystem {
            root: Directory,
            current_path: String,
        }
        
        impl FileSystem {
            pub fn new() -> FileSystem {
                FileSystem {
                    root: Directory::new("root".to_string()),
                    current_path: "/".to_string(),
                }
            }
            
            pub fn create_file(&mut self, name: String, content: String) {
                let file = File::new(name, content);
                self.root.add_file(file);
            }
            
            pub fn read_file(&self, name: &str) -> Result<String, String> {
                if let Some(file) = self.root.get_file(name) {
                    file.read().map(|s| s.clone())
                } else {
                    Err("文件不存在".to_string())
                }
            }
            
            pub fn write_file(&mut self, name: &str, content: String) -> Result<(), String> {
                if let Some(file) = self.root.get_file_mut(name) {
                    file.write(content)
                } else {
                    Err("文件不存在".to_string())
                }
            }
            
            pub fn list_files(&self) {
                self.root.list_contents();
            }
            
            pub fn get_filesystem_size(&self) -> u64 {
                self.root.get_total_size()
            }
        }
    }
}

// 重新导出
pub use filesystem::file::File;
pub use filesystem::directory::Directory;
pub use filesystem::filesystem::FileSystem;

fn main() {
    let mut fs = FileSystem::new();
    
    // 创建文件
    fs.create_file("readme.txt".to_string(), "这是一个README文件".to_string());
    fs.create_file("config.json".to_string(), r#"{"debug": true, "port": 8080}"#.to_string());
    
    // 列出文件
    fs.list_files();
    
    // 读取文件
    match fs.read_file("readme.txt") {
        Ok(content) => println!("读取内容: {}", content),
        Err(e) => println!("读取失败: {}", e),
    }
    
    // 写入文件
    match fs.write_file("readme.txt", "更新后的README内容".to_string()) {
        Ok(_) => println!("文件写入成功"),
        Err(e) => println!("写入失败: {}", e),
    }
    
    // 再次读取
    match fs.read_file("readme.txt") {
        Ok(content) => println!("更新后的内容: {}", content),
        Err(e) => println!("读取失败: {}", e),
    }
    
    println!("文件系统总大小: {} 字节", fs.get_filesystem_size());
}
```

## 练习3：配置管理模块

```rust
// src/lib.rs
mod config {
    pub mod types {
        use std::collections::HashMap;
        
        #[derive(Debug, Clone)]
        pub struct DatabaseConfig {
            pub host: String,
            pub port: u16,
            pub username: String,
            pub password: String,
            pub database: String,
        }
        
        #[derive(Debug, Clone)]
        pub struct ServerConfig {
            pub host: String,
            pub port: u16,
            pub max_connections: u32,
            pub timeout: u64,
        }
        
        #[derive(Debug, Clone)]
        pub struct AppConfig {
            pub app_name: String,
            pub version: String,
            pub debug: bool,
            pub database: DatabaseConfig,
            pub server: ServerConfig,
            pub custom_settings: HashMap<String, String>,
        }
    }
    
    pub mod loader {
        use super::types::*;
        use std::collections::HashMap;
        
        pub struct ConfigLoader;
        
        impl ConfigLoader {
            pub fn load_default() -> AppConfig {
                AppConfig {
                    app_name: "MyApp".to_string(),
                    version: "1.0.0".to_string(),
                    debug: false,
                    database: DatabaseConfig {
                        host: "localhost".to_string(),
                        port: 5432,
                        username: "admin".to_string(),
                        password: "password".to_string(),
                        database: "myapp".to_string(),
                    },
                    server: ServerConfig {
                        host: "0.0.0.0".to_string(),
                        port: 8080,
                        max_connections: 100,
                        timeout: 30,
                    },
                    custom_settings: HashMap::new(),
                }
            }
            
            pub fn load_from_env() -> AppConfig {
                let mut config = Self::load_default();
                
                // 从环境变量加载配置
                if let Ok(debug) = std::env::var("DEBUG") {
                    config.debug = debug == "true";
                }
                
                if let Ok(port) = std::env::var("PORT") {
                    if let Ok(port_num) = port.parse::<u16>() {
                        config.server.port = port_num;
                    }
                }
                
                if let Ok(db_host) = std::env::var("DB_HOST") {
                    config.database.host = db_host;
                }
                
                config
            }
        }
    }
    
    pub mod validator {
        use super::types::*;
        
        pub struct ConfigValidator;
        
        impl ConfigValidator {
            pub fn validate(config: &AppConfig) -> Result<(), String> {
                // 验证应用名称
                if config.app_name.is_empty() {
                    return Err("应用名称不能为空".to_string());
                }
                
                // 验证数据库配置
                if config.database.host.is_empty() {
                    return Err("数据库主机不能为空".to_string());
                }
                
                if config.database.port == 0 {
                    return Err("数据库端口不能为0".to_string());
                }
                
                // 验证服务器配置
                if config.server.port == 0 {
                    return Err("服务器端口不能为0".to_string());
                }
                
                if config.server.max_connections == 0 {
                    return Err("最大连接数不能为0".to_string());
                }
                
                Ok(())
            }
        }
    }
    
    pub mod manager {
        use super::types::*;
        use super::loader::ConfigLoader;
        use super::validator::ConfigValidator;
        
        pub struct ConfigManager {
            config: AppConfig,
        }
        
        impl ConfigManager {
            pub fn new() -> Result<ConfigManager, String> {
                let config = ConfigLoader::load_from_env();
                ConfigValidator::validate(&config)?;
                
                Ok(ConfigManager { config })
            }
            
            pub fn get_config(&self) -> &AppConfig {
                &self.config
            }
            
            pub fn get_database_config(&self) -> &DatabaseConfig {
                &self.config.database
            }
            
            pub fn get_server_config(&self) -> &ServerConfig {
                &self.config.server
            }
            
            pub fn is_debug_mode(&self) -> bool {
                self.config.debug
            }
            
            pub fn get_custom_setting(&self, key: &str) -> Option<&String> {
                self.config.custom_settings.get(key)
            }
            
            pub fn set_custom_setting(&mut self, key: String, value: String) {
                self.config.custom_settings.insert(key, value);
            }
        }
    }
}

// 重新导出
pub use config::types::*;
pub use config::manager::ConfigManager;

fn main() {
    match ConfigManager::new() {
        Ok(mut manager) => {
            println!("配置加载成功");
            println!("应用配置: {:?}", manager.get_config());
            
            // 添加自定义设置
            manager.set_custom_setting("theme".to_string(), "dark".to_string());
            manager.set_custom_setting("language".to_string(), "zh-CN".to_string());
            
            // 获取自定义设置
            if let Some(theme) = manager.get_custom_setting("theme") {
                println!("主题: {}", theme);
            }
            
            if let Some(language) = manager.get_custom_setting("language") {
                println!("语言: {}", language);
            }
            
            println!("调试模式: {}", manager.is_debug_mode());
        }
        Err(e) => println!("配置加载失败: {}", e),
    }
}
```

## 练习4：日志系统模块

```rust
// src/lib.rs
mod logging {
    pub mod levels {
        #[derive(Debug, Clone, PartialEq)]
        pub enum LogLevel {
            Debug,
            Info,
            Warning,
            Error,
        }
        
        impl LogLevel {
            pub fn to_string(&self) -> &'static str {
                match self {
                    LogLevel::Debug => "DEBUG",
                    LogLevel::Info => "INFO",
                    LogLevel::Warning => "WARNING",
                    LogLevel::Error => "ERROR",
                }
            }
            
            pub fn priority(&self) -> u8 {
                match self {
                    LogLevel::Debug => 0,
                    LogLevel::Info => 1,
                    LogLevel::Warning => 2,
                    LogLevel::Error => 3,
                }
            }
        }
    }
    
    pub mod formatters {
        use super::levels::LogLevel;
        use std::time::SystemTime;
        
        pub struct LogFormatter;
        
        impl LogFormatter {
            pub fn format(level: LogLevel, message: &str) -> String {
                let timestamp = SystemTime::now()
                    .duration_since(SystemTime::UNIX_EPOCH)
                    .unwrap()
                    .as_secs();
                
                format!("[{}] {}: {}", timestamp, level.to_string(), message)
            }
        }
    }
    
    pub mod handlers {
        use super::levels::LogLevel;
        use super::formatters::LogFormatter;
        use std::fs::OpenOptions;
        use std::io::Write;
        
        pub trait LogHandler {
            fn handle(&self, level: LogLevel, message: &str);
        }
        
        pub struct ConsoleHandler;
        
        impl LogHandler for ConsoleHandler {
            fn handle(&self, level: LogLevel, message: &str) {
                let formatted = LogFormatter::format(level, message);
                println!("{}", formatted);
            }
        }
        
        pub struct FileHandler {
            file_path: String,
        }
        
        impl FileHandler {
            pub fn new(file_path: String) -> FileHandler {
                FileHandler { file_path }
            }
        }
        
        impl LogHandler for FileHandler {
            fn handle(&self, level: LogLevel, message: &str) {
                let formatted = LogFormatter::format(level, message);
                if let Ok(mut file) = OpenOptions::new()
                    .create(true)
                    .append(true)
                    .open(&self.file_path) {
                    let _ = writeln!(file, "{}", formatted);
                }
            }
        }
    }
    
    pub mod logger {
        use super::levels::LogLevel;
        use super::handlers::{LogHandler, ConsoleHandler, FileHandler};
        use std::sync::Arc;
        
        pub struct Logger {
            handlers: Vec<Arc<dyn LogHandler>>,
            min_level: LogLevel,
        }
        
        impl Logger {
            pub fn new(min_level: LogLevel) -> Logger {
                Logger {
                    handlers: Vec::new(),
                    min_level,
                }
            }
            
            pub fn add_handler(&mut self, handler: Arc<dyn LogHandler>) {
                self.handlers.push(handler);
            }
            
            pub fn log(&self, level: LogLevel, message: &str) {
                if level.priority() >= self.min_level.priority() {
                    for handler in &self.handlers {
                        handler.handle(level, message);
                    }
                }
            }
            
            pub fn debug(&self, message: &str) {
                self.log(LogLevel::Debug, message);
            }
            
            pub fn info(&self, message: &str) {
                self.log(LogLevel::Info, message);
            }
            
            pub fn warning(&self, message: &str) {
                self.log(LogLevel::Warning, message);
            }
            
            pub fn error(&self, message: &str) {
                self.log(LogLevel::Error, message);
            }
        }
    }
}

// 重新导出
pub use logging::levels::LogLevel;
pub use logging::handlers::{LogHandler, ConsoleHandler, FileHandler};
pub use logging::logger::Logger;

fn main() {
    use std::sync::Arc;
    
    // 创建日志记录器
    let mut logger = Logger::new(LogLevel::Info);
    
    // 添加控制台处理器
    let console_handler = Arc::new(ConsoleHandler);
    logger.add_handler(console_handler);
    
    // 添加文件处理器
    let file_handler = Arc::new(FileHandler::new("app.log".to_string()));
    logger.add_handler(file_handler);
    
    // 记录不同级别的日志
    logger.debug("这是调试信息");
    logger.info("应用程序启动");
    logger.warning("这是一个警告");
    logger.error("发生了一个错误");
    
    println!("日志记录完成，请检查app.log文件");
}
```

## 模块组织最佳实践

### 1. 模块结构

```
src/
├── lib.rs              # 库根文件
├── main.rs             # 二进制根文件
├── config/             # 配置相关模块
│   ├── mod.rs
│   ├── database.rs
│   └── server.rs
├── handlers/           # 处理器模块
│   ├── mod.rs
│   ├── user.rs
│   └── auth.rs
└── utils/              # 工具模块
    ├── mod.rs
    ├── validation.rs
    └── formatting.rs
```

### 2. 可见性控制

```rust
// 好的做法：明确的可见性
pub mod public_module;
mod private_module;

pub use public_module::PublicType;

// 避免：过度暴露内部实现
// pub mod internal_details;
```

### 3. 重新导出

```rust
// 在lib.rs中重新导出公共API
pub use config::Config;
pub use handlers::UserHandler;
pub use utils::ValidationError;

// 隐藏内部模块
mod internal;
```

## 下一步

现在您已经掌握了Rust的模块系统。接下来我们将创建实践项目，包括计算器、文件处理工具和简单Web服务器。

