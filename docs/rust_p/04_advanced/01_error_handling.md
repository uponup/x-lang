# 错误处理

## 错误处理概述

Rust没有异常，而是使用`Result<T, E>`和`Option<T>`类型来处理可能的错误。

### 两种主要错误类型

1. **可恢复错误**：使用`Result<T, E>`
2. **不可恢复错误**：使用`panic!`宏

## Option类型

### 基本使用

```rust
fn main() {
    let some_number = Some(5);
    let some_string = Some("a string");
    let absent_number: Option<i32> = None;
    
    println!("some_number: {:?}", some_number);
    println!("some_string: {:?}", some_string);
    println!("absent_number: {:?}", absent_number);
    
    // 使用match处理Option
    match some_number {
        Some(value) => println!("值是: {}", value),
        None => println!("没有值"),
    }
}
```

### Option的常用方法

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5];
    
    // 查找元素
    let first = numbers.first();
    let last = numbers.last();
    
    println!("第一个元素: {:?}", first);
    println!("最后一个元素: {:?}", last);
    
    // 使用unwrap_or提供默认值
    let value = first.unwrap_or(&0);
    println!("第一个元素或0: {}", value);
    
    // 使用map进行转换
    let doubled = first.map(|x| x * 2);
    println!("第一个元素的两倍: {:?}", doubled);
    
    // 使用and_then进行链式操作
    let result = first.and_then(|x| Some(x * 3));
    println!("链式操作结果: {:?}", result);
}
```

## Result类型

### 基本使用

```rust
fn main() {
    let result = divide(10, 2);
    match result {
        Ok(value) => println!("结果: {}", value),
        Err(error) => println!("错误: {}", error),
    }
    
    let result2 = divide(10, 0);
    match result2 {
        Ok(value) => println!("结果: {}", value),
        Err(error) => println!("错误: {}", error),
    }
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("除零错误".to_string())
    } else {
        Ok(a / b)
    }
}
```

### Result的常用方法

```rust
fn main() {
    let numbers = vec!["1", "2", "3", "4", "5"];
    
    // 使用map转换成功值
    let parsed: Result<Vec<i32>, _> = numbers.iter()
        .map(|s| s.parse::<i32>())
        .collect();
    
    match parsed {
        Ok(values) => println!("解析成功: {:?}", values),
        Err(e) => println!("解析失败: {}", e),
    }
    
    // 使用unwrap_or_else处理错误
    let safe_divide = |a: i32, b: i32| -> i32 {
        divide(a, b).unwrap_or_else(|_| 0)
    };
    
    println!("10 / 2 = {}", safe_divide(10, 2));
    println!("10 / 0 = {}", safe_divide(10, 0));
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("除零错误".to_string())
    } else {
        Ok(a / b)
    }
}
```

## 自定义错误类型

### 定义错误枚举

```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
    Overflow,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "除零错误"),
            MathError::NegativeSquareRoot => write!(f, "负数开方错误"),
            MathError::Overflow => write!(f, "溢出错误"),
        }
    }
}

fn safe_divide(a: i32, b: i32) -> Result<i32, MathError> {
    if b == 0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}

fn safe_sqrt(x: f64) -> Result<f64, MathError> {
    if x < 0.0 {
        Err(MathError::NegativeSquareRoot)
    } else {
        Ok(x.sqrt())
    }
}

fn main() {
    match safe_divide(10, 2) {
        Ok(result) => println!("10 / 2 = {}", result),
        Err(e) => println!("错误: {}", e),
    }
    
    match safe_sqrt(-1.0) {
        Ok(result) => println!("√(-1) = {}", result),
        Err(e) => println!("错误: {}", e),
    }
}
```

## 错误传播

### 使用?操作符

```rust
use std::fs::File;
use std::io::Error;

fn read_file(filename: &str) -> Result<String, Error> {
    let mut file = File::open(filename)?;
    let mut contents = String::new();
    std::io::Read::read_to_string(&mut file, &mut contents)?;
    Ok(contents)
}

fn main() {
    match read_file("hello.txt") {
        Ok(contents) => println!("文件内容: {}", contents),
        Err(e) => println!("读取文件失败: {}", e),
    }
}
```

### 自定义错误传播

```rust
use std::fmt;

#[derive(Debug)]
enum AppError {
    FileNotFound(String),
    ParseError(String),
    NetworkError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            AppError::FileNotFound(msg) => write!(f, "文件未找到: {}", msg),
            AppError::ParseError(msg) => write!(f, "解析错误: {}", msg),
            AppError::NetworkError(msg) => write!(f, "网络错误: {}", msg),
        }
    }
}

fn process_data(filename: &str) -> Result<String, AppError> {
    // 模拟文件读取
    if filename.is_empty() {
        return Err(AppError::FileNotFound("文件名不能为空".to_string()));
    }
    
    // 模拟数据解析
    if filename.contains("invalid") {
        return Err(AppError::ParseError("无效的数据格式".to_string()));
    }
    
    Ok(format!("处理文件: {}", filename))
}

fn main() {
    let results = vec![
        process_data("data.txt"),
        process_data(""),
        process_data("invalid_data.txt"),
    ];
    
    for result in results {
        match result {
            Ok(data) => println!("成功: {}", data),
            Err(e) => println!("错误: {}", e),
        }
    }
}
```

## 练习1：文件操作错误处理

```rust
use std::fs::File;
use std::io::{self, Read, Write};

#[derive(Debug)]
enum FileError {
    IoError(io::Error),
    EmptyFile,
    InvalidContent,
}

impl From<io::Error> for FileError {
    fn from(error: io::Error) -> Self {
        FileError::IoError(error)
    }
}

fn read_and_validate_file(filename: &str) -> Result<String, FileError> {
    let mut file = File::open(filename)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    
    if contents.is_empty() {
        return Err(FileError::EmptyFile);
    }
    
    if contents.contains("ERROR") {
        return Err(FileError::InvalidContent);
    }
    
    Ok(contents)
}

fn write_to_file(filename: &str, content: &str) -> Result<(), FileError> {
    let mut file = File::create(filename)?;
    file.write_all(content.as_bytes())?;
    Ok(())
}

fn main() {
    let filename = "test.txt";
    
    // 创建测试文件
    if let Err(e) = write_to_file(filename, "Hello, World!") {
        println!("创建文件失败: {:?}", e);
        return;
    }
    
    // 读取并验证文件
    match read_and_validate_file(filename) {
        Ok(content) => println!("文件内容: {}", content),
        Err(FileError::EmptyFile) => println!("文件为空"),
        Err(FileError::InvalidContent) => println!("文件包含无效内容"),
        Err(FileError::IoError(e)) => println!("IO错误: {}", e),
    }
}
```

## 练习2：网络请求模拟

```rust
use std::fmt;

#[derive(Debug)]
enum NetworkError {
    Timeout,
    ConnectionRefused,
    InvalidResponse,
    ServerError(u16),
}

impl fmt::Display for NetworkError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            NetworkError::Timeout => write!(f, "请求超时"),
            NetworkError::ConnectionRefused => write!(f, "连接被拒绝"),
            NetworkError::InvalidResponse => write!(f, "无效响应"),
            NetworkError::ServerError(code) => write!(f, "服务器错误: {}", code),
        }
    }
}

fn simulate_request(url: &str) -> Result<String, NetworkError> {
    match url {
        "timeout" => Err(NetworkError::Timeout),
        "refused" => Err(NetworkError::ConnectionRefused),
        "invalid" => Err(NetworkError::InvalidResponse),
        "server_error" => Err(NetworkError::ServerError(500)),
        _ => Ok(format!("成功获取: {}", url)),
    }
}

fn main() {
    let urls = vec![
        "https://api.example.com/data",
        "timeout",
        "refused",
        "invalid",
        "server_error",
    ];
    
    for url in urls {
        match simulate_request(url) {
            Ok(response) => println!("✅ {}", response),
            Err(e) => println!("❌ {}: {}", url, e),
        }
    }
}
```

## 练习3：数据库操作模拟

```rust
use std::fmt;

#[derive(Debug)]
enum DatabaseError {
    ConnectionFailed,
    QueryTimeout,
    RecordNotFound,
    DuplicateKey,
    InvalidData(String),
}

impl fmt::Display for DatabaseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            DatabaseError::ConnectionFailed => write!(f, "数据库连接失败"),
            DatabaseError::QueryTimeout => write!(f, "查询超时"),
            DatabaseError::RecordNotFound => write!(f, "记录未找到"),
            DatabaseError::DuplicateKey => write!(f, "重复键错误"),
            DatabaseError::InvalidData(msg) => write!(f, "无效数据: {}", msg),
        }
    }
}

#[derive(Debug)]
struct User {
    id: u32,
    name: String,
    email: String,
}

struct Database {
    users: Vec<User>,
}

impl Database {
    fn new() -> Database {
        Database {
            users: vec![
                User {
                    id: 1,
                    name: "张三".to_string(),
                    email: "zhangsan@example.com".to_string(),
                },
                User {
                    id: 2,
                    name: "李四".to_string(),
                    email: "lisi@example.com".to_string(),
                },
            ],
        }
    }
    
    fn find_user(&self, id: u32) -> Result<&User, DatabaseError> {
        self.users.iter()
            .find(|user| user.id == id)
            .ok_or(DatabaseError::RecordNotFound)
    }
    
    fn create_user(&mut self, name: String, email: String) -> Result<u32, DatabaseError> {
        if name.is_empty() {
            return Err(DatabaseError::InvalidData("用户名不能为空".to_string()));
        }
        
        if !email.contains('@') {
            return Err(DatabaseError::InvalidData("邮箱格式无效".to_string()));
        }
        
        // 检查邮箱是否已存在
        if self.users.iter().any(|user| user.email == email) {
            return Err(DatabaseError::DuplicateKey);
        }
        
        let new_id = self.users.len() as u32 + 1;
        let new_user = User {
            id: new_id,
            name,
            email,
        };
        
        self.users.push(new_user);
        Ok(new_id)
    }
    
    fn update_user(&mut self, id: u32, name: Option<String>, email: Option<String>) -> Result<(), DatabaseError> {
        let user = self.find_user(id)?;
        
        if let Some(new_name) = name {
            if new_name.is_empty() {
                return Err(DatabaseError::InvalidData("用户名不能为空".to_string()));
            }
        }
        
        if let Some(new_email) = email {
            if !new_email.contains('@') {
                return Err(DatabaseError::InvalidData("邮箱格式无效".to_string()));
            }
        }
        
        // 实际更新逻辑...
        Ok(())
    }
}

fn main() {
    let mut db = Database::new();
    
    // 查找用户
    match db.find_user(1) {
        Ok(user) => println!("找到用户: {:?}", user),
        Err(e) => println!("查找失败: {}", e),
    }
    
    // 创建新用户
    match db.create_user("王五".to_string(), "wangwu@example.com".to_string()) {
        Ok(id) => println!("创建用户成功，ID: {}", id),
        Err(e) => println!("创建失败: {}", e),
    }
    
    // 创建重复邮箱的用户
    match db.create_user("赵六".to_string(), "zhangsan@example.com".to_string()) {
        Ok(id) => println!("创建用户成功，ID: {}", id),
        Err(e) => println!("创建失败: {}", e),
    }
    
    // 创建无效数据的用户
    match db.create_user("".to_string(), "invalid-email".to_string()) {
        Ok(id) => println!("创建用户成功，ID: {}", id),
        Err(e) => println!("创建失败: {}", e),
    }
}
```

## 练习4：配置解析器

```rust
use std::collections::HashMap;
use std::fmt;

#[derive(Debug)]
enum ConfigError {
    FileNotFound,
    ParseError(String),
    MissingKey(String),
    InvalidValue(String, String),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::FileNotFound => write!(f, "配置文件未找到"),
            ConfigError::ParseError(msg) => write!(f, "解析错误: {}", msg),
            ConfigError::MissingKey(key) => write!(f, "缺少必需的配置项: {}", key),
            ConfigError::InvalidValue(key, value) => write!(f, "配置项'{}'的值'{}'无效", key, value),
        }
    }
}

struct Config {
    values: HashMap<String, String>,
}

impl Config {
    fn new() -> Config {
        Config {
            values: HashMap::new(),
        }
    }
    
    fn load_from_string(content: &str) -> Result<Config, ConfigError> {
        let mut config = Config::new();
        
        for line in content.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            
            if let Some((key, value)) = line.split_once('=') {
                config.values.insert(key.trim().to_string(), value.trim().to_string());
            } else {
                return Err(ConfigError::ParseError(format!("无效的行: {}", line)));
            }
        }
        
        Ok(config)
    }
    
    fn get_string(&self, key: &str) -> Result<String, ConfigError> {
        self.values.get(key)
            .cloned()
            .ok_or_else(|| ConfigError::MissingKey(key.to_string()))
    }
    
    fn get_int(&self, key: &str) -> Result<i32, ConfigError> {
        let value = self.get_string(key)?;
        value.parse::<i32>()
            .map_err(|_| ConfigError::InvalidValue(key.to_string(), value))
    }
    
    fn get_bool(&self, key: &str) -> Result<bool, ConfigError> {
        let value = self.get_string(key)?;
        match value.to_lowercase().as_str() {
            "true" | "1" | "yes" | "on" => Ok(true),
            "false" | "0" | "no" | "off" => Ok(false),
            _ => Err(ConfigError::InvalidValue(key.to_string(), value)),
        }
    }
}

fn main() {
    let config_content = r#"
# 数据库配置
db_host=localhost
db_port=5432
db_name=myapp
debug_mode=true
max_connections=100
"#;
    
    match Config::load_from_string(config_content) {
        Ok(config) => {
            println!("配置加载成功");
            
            // 读取各种类型的配置
            match config.get_string("db_host") {
                Ok(host) => println!("数据库主机: {}", host),
                Err(e) => println!("错误: {}", e),
            }
            
            match config.get_int("db_port") {
                Ok(port) => println!("数据库端口: {}", port),
                Err(e) => println!("错误: {}", e),
            }
            
            match config.get_bool("debug_mode") {
                Ok(debug) => println!("调试模式: {}", debug),
                Err(e) => println!("错误: {}", e),
            }
            
            match config.get_int("max_connections") {
                Ok(max) => println!("最大连接数: {}", max),
                Err(e) => println!("错误: {}", e),
            }
        }
        Err(e) => println!("配置加载失败: {}", e),
    }
}
```

## 错误处理最佳实践

### 1. 使用适当的错误类型

```rust
// 好的做法：具体的错误类型
enum ValidationError {
    EmptyField(String),
    InvalidFormat(String),
    OutOfRange(String, i32, i32),
}

// 避免：过于通用的错误类型
// type Result<T> = Result<T, String>;
```

### 2. 实现Display trait

```rust
impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ValidationError::EmptyField(field) => write!(f, "字段'{}'不能为空", field),
            ValidationError::InvalidFormat(field) => write!(f, "字段'{}'格式无效", field),
            ValidationError::OutOfRange(field, min, max) => {
                write!(f, "字段'{}'的值必须在{}和{}之间", field, min, max)
            }
        }
    }
}
```

### 3. 使用?操作符简化错误处理

```rust
fn process_data(input: &str) -> Result<String, AppError> {
    let parsed = parse_input(input)?;
    let validated = validate_data(parsed)?;
    let processed = transform_data(validated)?;
    Ok(processed)
}
```

## 下一步

现在您已经掌握了Rust的错误处理。接下来我们将学习模块和包管理，这是组织大型Rust项目的重要技能。

