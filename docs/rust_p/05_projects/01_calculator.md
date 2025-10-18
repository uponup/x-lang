# 实践项目1：命令行计算器

## 项目概述

我们将创建一个功能完整的命令行计算器，支持基本数学运算、历史记录、变量存储等功能。

## 项目结构

```
calculator/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── parser.rs
│   ├── evaluator.rs
│   ├── history.rs
│   └── variables.rs
└── README.md
```

## 创建项目

```bash
cargo new calculator
cd calculator
```

## 核心代码实现

### 1. Cargo.toml

```toml
[package]
name = "calculator"
version = "0.1.0"
edition = "2021"
authors = ["Rust Learner <learner@example.com>"]
description = "一个功能强大的命令行计算器"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

### 2. src/lib.rs

```rust
pub mod parser;
pub mod evaluator;
pub mod history;
pub mod variables;

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub enum Token {
    Number(f64),
    Plus,
    Minus,
    Multiply,
    Divide,
    Power,
    LeftParen,
    RightParen,
    Variable(String),
    Assign,
}

#[derive(Debug)]
pub struct Calculator {
    variables: HashMap<String, f64>,
    history: Vec<String>,
}

impl Calculator {
    pub fn new() -> Calculator {
        Calculator {
            variables: HashMap::new(),
            history: Vec::new(),
        }
    }
    
    pub fn calculate(&mut self, expression: &str) -> Result<f64, String> {
        // 记录历史
        self.history.push(expression.to_string());
        
        // 解析表达式
        let tokens = parser::parse(expression)?;
        
        // 计算表达式
        let result = evaluator::evaluate(&tokens, &self.variables)?;
        
        Ok(result)
    }
    
    pub fn set_variable(&mut self, name: String, value: f64) {
        self.variables.insert(name, value);
    }
    
    pub fn get_variable(&self, name: &str) -> Option<f64> {
        self.variables.get(name).copied()
    }
    
    pub fn list_variables(&self) {
        println!("变量列表:");
        for (name, value) in &self.variables {
            println!("  {} = {}", name, value);
        }
    }
    
    pub fn show_history(&self) {
        println!("计算历史:");
        for (i, expr) in self.history.iter().enumerate() {
            println!("  {}: {}", i + 1, expr);
        }
    }
    
    pub fn clear_history(&mut self) {
        self.history.clear();
    }
}
```

### 3. src/parser.rs

```rust
use crate::Token;

pub fn parse(input: &str) -> Result<Vec<Token>, String> {
    let mut tokens = Vec::new();
    let mut chars = input.chars().peekable();
    
    while let Some(ch) = chars.next() {
        match ch {
            ' ' | '\t' | '\n' => continue, // 跳过空白字符
            '+' => tokens.push(Token::Plus),
            '-' => tokens.push(Token::Minus),
            '*' => tokens.push(Token::Multiply),
            '/' => tokens.push(Token::Divide),
            '^' => tokens.push(Token::Power),
            '(' => tokens.push(Token::LeftParen),
            ')' => tokens.push(Token::RightParen),
            '=' => tokens.push(Token::Assign),
            '0'..='9' | '.' => {
                let mut number = String::new();
                number.push(ch);
                
                while let Some(&next_ch) = chars.peek() {
                    if next_ch.is_ascii_digit() || next_ch == '.' {
                        number.push(chars.next().unwrap());
                    } else {
                        break;
                    }
                }
                
                let num = number.parse::<f64>()
                    .map_err(|_| format!("无效数字: {}", number))?;
                tokens.push(Token::Number(num));
            }
            'a'..='z' | 'A'..='Z' | '_' => {
                let mut var_name = String::new();
                var_name.push(ch);
                
                while let Some(&next_ch) = chars.peek() {
                    if next_ch.is_ascii_alphanumeric() || next_ch == '_' {
                        var_name.push(chars.next().unwrap());
                    } else {
                        break;
                    }
                }
                
                tokens.push(Token::Variable(var_name));
            }
            _ => return Err(format!("未知字符: {}", ch)),
        }
    }
    
    Ok(tokens)
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_parse_simple() {
        let tokens = parse("1 + 2").unwrap();
        assert_eq!(tokens.len(), 3);
    }
    
    #[test]
    fn test_parse_with_variables() {
        let tokens = parse("x = 5").unwrap();
        assert_eq!(tokens.len(), 3);
    }
}
```

### 4. src/evaluator.rs

```rust
use crate::Token;
use std::collections::HashMap;

pub fn evaluate(tokens: &[Token], variables: &HashMap<String, f64>) -> Result<f64, String> {
    let mut iter = tokens.iter().peekable();
    let result = parse_expression(&mut iter, variables)?;
    
    if iter.peek().is_some() {
        return Err("表达式不完整".to_string());
    }
    
    Ok(result)
}

fn parse_expression(
    iter: &mut std::iter::Peekable<std::slice::Iter<Token>>,
    variables: &HashMap<String, f64>,
) -> Result<f64, String> {
    let mut left = parse_term(iter, variables)?;
    
    while let Some(token) = iter.peek() {
        match token {
            Token::Plus => {
                iter.next();
                left += parse_term(iter, variables)?;
            }
            Token::Minus => {
                iter.next();
                left -= parse_term(iter, variables)?;
            }
            _ => break,
        }
    }
    
    Ok(left)
}

fn parse_term(
    iter: &mut std::iter::Peekable<std::slice::Iter<Token>>,
    variables: &HashMap<String, f64>,
) -> Result<f64, String> {
    let mut left = parse_factor(iter, variables)?;
    
    while let Some(token) = iter.peek() {
        match token {
            Token::Multiply => {
                iter.next();
                left *= parse_factor(iter, variables)?;
            }
            Token::Divide => {
                iter.next();
                let right = parse_factor(iter, variables)?;
                if right == 0.0 {
                    return Err("除零错误".to_string());
                }
                left /= right;
            }
            _ => break,
        }
    }
    
    Ok(left)
}

fn parse_factor(
    iter: &mut std::iter::Peekable<std::slice::Iter<Token>>,
    variables: &HashMap<String, f64>,
) -> Result<f64, String> {
    let mut left = parse_primary(iter, variables)?;
    
    while let Some(token) = iter.peek() {
        match token {
            Token::Power => {
                iter.next();
                let right = parse_primary(iter, variables)?;
                left = left.powf(right);
            }
            _ => break,
        }
    }
    
    Ok(left)
}

fn parse_primary(
    iter: &mut std::iter::Peekable<std::slice::Iter<Token>>,
    variables: &HashMap<String, f64>,
) -> Result<f64, String> {
    match iter.next() {
        Some(Token::Number(n)) => Ok(*n),
        Some(Token::Variable(name)) => {
            variables.get(name)
                .copied()
                .ok_or_else(|| format!("未定义变量: {}", name))
        }
        Some(Token::LeftParen) => {
            let result = parse_expression(iter, variables)?;
            match iter.next() {
                Some(Token::RightParen) => Ok(result),
                _ => Err("缺少右括号".to_string()),
            }
        }
        Some(Token::Minus) => {
            let result = parse_primary(iter, variables)?;
            Ok(-result)
        }
        _ => Err("意外的标记".to_string()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashMap;
    
    #[test]
    fn test_evaluate_simple() {
        let tokens = vec![
            Token::Number(2.0),
            Token::Plus,
            Token::Number(3.0),
        ];
        let variables = HashMap::new();
        assert_eq!(evaluate(&tokens, &variables).unwrap(), 5.0);
    }
    
    #[test]
    fn test_evaluate_with_parentheses() {
        let tokens = vec![
            Token::LeftParen,
            Token::Number(2.0),
            Token::Plus,
            Token::Number(3.0),
            Token::RightParen,
            Token::Multiply,
            Token::Number(4.0),
        ];
        let variables = HashMap::new();
        assert_eq!(evaluate(&tokens, &variables).unwrap(), 20.0);
    }
}
```

### 5. src/history.rs

```rust
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, Read, Write};

#[derive(Serialize, Deserialize)]
pub struct HistoryEntry {
    pub expression: String,
    pub result: f64,
    pub timestamp: String,
}

pub struct HistoryManager {
    entries: Vec<HistoryEntry>,
    file_path: String,
}

impl HistoryManager {
    pub fn new(file_path: String) -> HistoryManager {
        HistoryManager {
            entries: Vec::new(),
            file_path,
        }
    }
    
    pub fn add_entry(&mut self, expression: String, result: f64) {
        let entry = HistoryEntry {
            expression,
            result,
            timestamp: chrono::Utc::now().to_rfc3339(),
        };
        self.entries.push(entry);
    }
    
    pub fn load_from_file(&mut self) -> Result<(), io::Error> {
        match File::open(&self.file_path) {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)?;
                self.entries = serde_json::from_str(&contents).unwrap_or_default();
            }
            Err(_) => {
                // 文件不存在，创建空历史
                self.entries = Vec::new();
            }
        }
        Ok(())
    }
    
    pub fn save_to_file(&self) -> Result<(), io::Error> {
        let mut file = File::create(&self.file_path)?;
        let json = serde_json::to_string_pretty(&self.entries)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
    
    pub fn list_entries(&self, limit: Option<usize>) {
        let entries = if let Some(limit) = limit {
            self.entries.iter().rev().take(limit).collect::<Vec<_>>()
        } else {
            self.entries.iter().rev().collect()
        };
        
        println!("计算历史:");
        for (i, entry) in entries.iter().enumerate() {
            println!("  {}: {} = {} ({})", 
                    i + 1, 
                    entry.expression, 
                    entry.result, 
                    entry.timestamp);
        }
    }
    
    pub fn clear(&mut self) {
        self.entries.clear();
    }
}
```

### 6. src/variables.rs

```rust
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, Read, Write};

#[derive(Serialize, Deserialize)]
pub struct VariableStore {
    variables: HashMap<String, f64>,
}

impl VariableStore {
    pub fn new() -> VariableStore {
        VariableStore {
            variables: HashMap::new(),
        }
    }
    
    pub fn set(&mut self, name: String, value: f64) {
        self.variables.insert(name, value);
    }
    
    pub fn get(&self, name: &str) -> Option<f64> {
        self.variables.get(name).copied()
    }
    
    pub fn list(&self) {
        if self.variables.is_empty() {
            println!("没有定义变量");
            return;
        }
        
        println!("变量列表:");
        for (name, value) in &self.variables {
            println!("  {} = {}", name, value);
        }
    }
    
    pub fn load_from_file(&mut self, file_path: &str) -> Result<(), io::Error> {
        match File::open(file_path) {
            Ok(mut file) => {
                let mut contents = String::new();
                file.read_to_string(&mut contents)?;
                self.variables = serde_json::from_str(&contents).unwrap_or_default();
            }
            Err(_) => {
                // 文件不存在，创建空存储
                self.variables = HashMap::new();
            }
        }
        Ok(())
    }
    
    pub fn save_to_file(&self, file_path: &str) -> Result<(), io::Error> {
        let mut file = File::create(file_path)?;
        let json = serde_json::to_string_pretty(&self.variables)?;
        file.write_all(json.as_bytes())?;
        Ok(())
    }
}
```

### 7. src/main.rs

```rust
use calculator::{Calculator, Token};
use std::io::{self, Write};

fn main() {
    println!("欢迎使用Rust计算器!");
    println!("输入 'help' 查看帮助，输入 'quit' 退出");
    
    let mut calculator = Calculator::new();
    
    loop {
        print!("calc> ");
        io::stdout().flush().unwrap();
        
        let mut input = String::new();
        io::stdin().read_line(&mut input).unwrap();
        let input = input.trim();
        
        if input.is_empty() {
            continue;
        }
        
        match input {
            "quit" | "exit" | "q" => {
                println!("再见!");
                break;
            }
            "help" | "h" => {
                show_help();
            }
            "vars" | "variables" => {
                calculator.list_variables();
            }
            "history" => {
                calculator.show_history();
            }
            "clear" => {
                calculator.clear_history();
                println!("历史已清空");
            }
            _ => {
                if let Some(assign_pos) = input.find('=') {
                    // 处理变量赋值
                    let var_name = input[..assign_pos].trim().to_string();
                    let expression = input[assign_pos + 1..].trim();
                    
                    match calculator.calculate(expression) {
                        Ok(result) => {
                            calculator.set_variable(var_name.clone(), result);
                            println!("{} = {}", var_name, result);
                        }
                        Err(e) => println!("错误: {}", e),
                    }
                } else {
                    // 处理普通计算
                    match calculator.calculate(input) {
                        Ok(result) => println!("= {}", result),
                        Err(e) => println!("错误: {}", e),
                    }
                }
            }
        }
    }
}

fn show_help() {
    println!("Rust计算器帮助:");
    println!("  基本运算: +, -, *, /, ^ (幂)");
    println!("  括号: ( )");
    println!("  变量赋值: x = 5");
    println!("  使用变量: x + 3");
    println!("  命令:");
    println!("    help, h     - 显示此帮助");
    println!("    vars        - 显示所有变量");
    println!("    history     - 显示计算历史");
    println!("    clear       - 清空历史");
    println!("    quit, q     - 退出程序");
    println!("  示例:");
    println!("    2 + 3 * 4");
    println!("    (2 + 3) * 4");
    println!("    x = 10");
    println!("    x^2 + 2*x + 1");
}
```

## 运行和测试

### 编译和运行

```bash
# 编译项目
cargo build

# 运行项目
cargo run

# 发布版本
cargo build --release
```

### 使用示例

```
calc> 2 + 3 * 4
= 14

calc> (2 + 3) * 4
= 20

calc> x = 10
x = 10

calc> x^2 + 2*x + 1
= 121

calc> vars
变量列表:
  x = 10

calc> history
计算历史:
  1: 2 + 3 * 4
  2: (2 + 3) * 4
  3: x = 10
  4: x^2 + 2*x + 1

calc> quit
再见!
```

## 扩展功能

### 1. 添加更多数学函数

```rust
// 在evaluator.rs中添加
fn parse_function(
    iter: &mut std::iter::Peekable<std::slice::Iter<Token>>,
    variables: &HashMap<String, f64>,
) -> Result<f64, String> {
    // 实现sin, cos, tan, log等函数
}
```

### 2. 添加常量

```rust
// 在Calculator中添加
pub fn get_constants() -> HashMap<String, f64> {
    let mut constants = HashMap::new();
    constants.insert("pi".to_string(), std::f64::consts::PI);
    constants.insert("e".to_string(), std::f64::consts::E);
    constants
}
```

### 3. 添加单位转换

```rust
// 添加单位转换功能
pub fn convert_units(value: f64, from: &str, to: &str) -> Result<f64, String> {
    // 实现长度、重量、温度等单位转换
}
```

## 测试

```bash
# 运行测试
cargo test

# 运行特定测试
cargo test test_parse_simple
```

## 下一步

现在您已经完成了一个功能完整的计算器项目。接下来我们将学习文件处理工具项目。

