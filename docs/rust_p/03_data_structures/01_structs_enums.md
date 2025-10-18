# 结构体和枚举

## 结构体（Structs）

### 定义和使用结构体

```rust
#[derive(Debug)]
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    // 创建结构体实例
    let mut user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    
    // 访问字段
    println!("用户名: {}", user1.username);
    println!("邮箱: {}", user1.email);
    
    // 修改字段（需要mut）
    user1.email = String::from("anotheremail@example.com");
    user1.sign_in_count += 1;
    
    // 打印整个结构体
    println!("用户信息: {:?}", user1);
}
```

### 结构体更新语法

```rust
#[derive(Debug)]
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let user1 = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
    
    // 使用结构体更新语法
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername456"),
        ..user1  // 使用user1的其余字段
    };
    
    println!("用户1: {:?}", user1);
    println!("用户2: {:?}", user2);
}
```

### 元组结构体

```rust
#[derive(Debug)]
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
    
    println!("颜色: {:?}", black);
    println!("原点: {:?}", origin);
    
    // 访问元组结构体的字段
    println!("红色分量: {}", black.0);
    println!("X坐标: {}", origin.0);
}
```

### 单元结构体

```rust
#[derive(Debug)]
struct AlwaysEqual;

fn main() {
    let subject = AlwaysEqual;
    println!("单元结构体: {:?}", subject);
}
```

## 结构体方法

### 定义方法

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 关联函数（类似静态方法）
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
    
    // 方法（第一个参数是&self）
    fn area(&self) -> u32 {
        self.width * self.height
    }
    
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
    
    // 可变方法
    fn double_size(&mut self) {
        self.width *= 2;
        self.height *= 2;
    }
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
    
    let rect2 = Rectangle {
        width: 10,
        height: 40,
    };
    
    let rect3 = Rectangle {
        width: 60,
        height: 45,
    };
    
    println!("rect1的面积: {}", rect1.area());
    println!("rect1能容纳rect2吗? {}", rect1.can_hold(&rect2));
    println!("rect1能容纳rect3吗? {}", rect1.can_hold(&rect3));
    
    // 创建正方形
    let square = Rectangle::square(10);
    println!("正方形: {:?}", square);
    
    // 可变方法
    let mut rect4 = Rectangle {
        width: 5,
        height: 5,
    };
    rect4.double_size();
    println!("翻倍后: {:?}", rect4);
}
```

## 枚举（Enums）

### 基本枚举

```rust
#[derive(Debug)]
enum IpAddrKind {
    V4,
    V6,
}

#[derive(Debug)]
struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

fn main() {
    let home = IpAddr {
        kind: IpAddrKind::V4,
        address: String::from("127.0.0.1"),
    };
    
    let loopback = IpAddr {
        kind: IpAddrKind::V6,
        address: String::from("::1"),
    };
    
    println!("家庭地址: {:?}", home);
    println!("回环地址: {:?}", loopback);
}
```

### 带数据的枚举

```rust
#[derive(Debug)]
enum IpAddr {
    V4(String),
    V6(String),
}

#[derive(Debug)]
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let home = IpAddr::V4(String::from("127.0.0.1"));
    let loopback = IpAddr::V6(String::from("::1"));
    
    println!("家庭地址: {:?}", home);
    println!("回环地址: {:?}", loopback);
    
    let messages = vec![
        Message::Quit,
        Message::Move { x: 10, y: 20 },
        Message::Write(String::from("Hello")),
        Message::ChangeColor(255, 0, 0),
    ];
    
    for msg in messages {
        println!("消息: {:?}", msg);
    }
}
```

### Option枚举

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

## 练习1：学生管理系统

```rust
#[derive(Debug)]
struct Student {
    name: String,
    age: u32,
    grade: Grade,
    subjects: Vec<String>,
}

#[derive(Debug)]
enum Grade {
    A,
    B,
    C,
    D,
    F,
}

impl Student {
    fn new(name: String, age: u32, grade: Grade) -> Student {
        Student {
            name,
            age,
            grade,
            subjects: Vec::new(),
        }
    }
    
    fn add_subject(&mut self, subject: String) {
        self.subjects.push(subject);
    }
    
    fn get_grade_score(&self) -> u32 {
        match self.grade {
            Grade::A => 4,
            Grade::B => 3,
            Grade::C => 2,
            Grade::D => 1,
            Grade::F => 0,
        }
    }
    
    fn is_passing(&self) -> bool {
        match self.grade {
            Grade::F => false,
            _ => true,
        }
    }
}

fn main() {
    let mut student1 = Student::new(
        String::from("张三"),
        20,
        Grade::A,
    );
    
    student1.add_subject(String::from("数学"));
    student1.add_subject(String::from("物理"));
    student1.add_subject(String::from("化学"));
    
    println!("学生信息: {:?}", student1);
    println!("成绩分数: {}", student1.get_grade_score());
    println!("是否及格: {}", student1.is_passing());
}
```

## 练习2：几何图形计算

```rust
#[derive(Debug)]
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle { base: f64, height: f64 },
}

impl Shape {
    fn area(&self) -> f64 {
        match self {
            Shape::Circle { radius } => 3.14159 * radius * radius,
            Shape::Rectangle { width, height } => width * height,
            Shape::Triangle { base, height } => 0.5 * base * height,
        }
    }
    
    fn perimeter(&self) -> f64 {
        match self {
            Shape::Circle { radius } => 2.0 * 3.14159 * radius,
            Shape::Rectangle { width, height } => 2.0 * (width + height),
            Shape::Triangle { base, height } => {
                // 假设是等腰三角形
                let side = ((base / 2.0).powi(2) + height.powi(2)).sqrt();
                base + 2.0 * side
            }
        }
    }
}

fn main() {
    let shapes = vec![
        Shape::Circle { radius: 5.0 },
        Shape::Rectangle { width: 10.0, height: 5.0 },
        Shape::Triangle { base: 8.0, height: 6.0 },
    ];
    
    for shape in shapes {
        println!("图形: {:?}", shape);
        println!("面积: {:.2}", shape.area());
        println!("周长: {:.2}", shape.perimeter());
        println!("---");
    }
}
```

## 练习3：文件系统模拟

```rust
#[derive(Debug)]
enum FileType {
    Text,
    Image,
    Video,
    Audio,
    Document,
}

#[derive(Debug)]
struct File {
    name: String,
    size: u64,
    file_type: FileType,
    is_read_only: bool,
}

#[derive(Debug)]
enum FileSystemItem {
    File(File),
    Directory { name: String, items: Vec<FileSystemItem> },
}

impl FileSystemItem {
    fn new_file(name: String, size: u64, file_type: FileType) -> FileSystemItem {
        FileSystemItem::File(File {
            name,
            size,
            file_type,
            is_read_only: false,
        })
    }
    
    fn new_directory(name: String) -> FileSystemItem {
        FileSystemItem::Directory {
            name,
            items: Vec::new(),
        }
    }
    
    fn add_item(&mut self, item: FileSystemItem) {
        match self {
            FileSystemItem::Directory { items, .. } => {
                items.push(item);
            }
            FileSystemItem::File(_) => {
                println!("不能在文件中添加项目");
            }
        }
    }
    
    fn get_size(&self) -> u64 {
        match self {
            FileSystemItem::File(file) => file.size,
            FileSystemItem::Directory { items, .. } => {
                items.iter().map(|item| item.get_size()).sum()
            }
        }
    }
}

fn main() {
    let mut root = FileSystemItem::new_directory(String::from("root"));
    
    // 创建文件
    let document = FileSystemItem::new_file(
        String::from("readme.txt"),
        1024,
        FileType::Text,
    );
    
    let image = FileSystemItem::new_file(
        String::from("photo.jpg"),
        2048000,
        FileType::Image,
    );
    
    // 创建子目录
    let mut documents = FileSystemItem::new_directory(String::from("documents"));
    documents.add_item(document);
    
    // 添加到根目录
    root.add_item(documents);
    root.add_item(image);
    
    println!("文件系统: {:?}", root);
    println!("总大小: {} 字节", root.get_size());
}
```

## 练习4：状态机

```rust
#[derive(Debug, PartialEq)]
enum State {
    Idle,
    Running,
    Paused,
    Stopped,
}

#[derive(Debug)]
struct Task {
    name: String,
    state: State,
    progress: u32,
}

impl Task {
    fn new(name: String) -> Task {
        Task {
            name,
            state: State::Idle,
            progress: 0,
        }
    }
    
    fn start(&mut self) -> Result<(), String> {
        match self.state {
            State::Idle => {
                self.state = State::Running;
                Ok(())
            }
            State::Paused => {
                self.state = State::Running;
                Ok(())
            }
            _ => Err(format!("无法从{:?}状态启动", self.state)),
        }
    }
    
    fn pause(&mut self) -> Result<(), String> {
        match self.state {
            State::Running => {
                self.state = State::Paused;
                Ok(())
            }
            _ => Err(format!("无法从{:?}状态暂停", self.state)),
        }
    }
    
    fn stop(&mut self) -> Result<(), String> {
        match self.state {
            State::Running | State::Paused => {
                self.state = State::Stopped;
                Ok(())
            }
            _ => Err(format!("无法从{:?}状态停止", self.state)),
        }
    }
    
    fn update_progress(&mut self, new_progress: u32) -> Result<(), String> {
        match self.state {
            State::Running => {
                self.progress = new_progress.min(100);
                Ok(())
            }
            _ => Err(format!("只能在运行状态下更新进度")),
        }
    }
}

fn main() {
    let mut task = Task::new(String::from("数据处理任务"));
    
    println!("初始状态: {:?}", task);
    
    // 启动任务
    match task.start() {
        Ok(_) => println!("任务已启动"),
        Err(e) => println!("启动失败: {}", e),
    }
    
    // 更新进度
    match task.update_progress(50) {
        Ok(_) => println!("进度已更新"),
        Err(e) => println!("更新失败: {}", e),
    }
    
    // 暂停任务
    match task.pause() {
        Ok(_) => println!("任务已暂停"),
        Err(e) => println!("暂停失败: {}", e),
    }
    
    // 停止任务
    match task.stop() {
        Ok(_) => println!("任务已停止"),
        Err(e) => println!("停止失败: {}", e),
    }
    
    println!("最终状态: {:?}", task);
}
```

## 练习5：简单计算器

```rust
#[derive(Debug)]
enum Operation {
    Add(f64, f64),
    Subtract(f64, f64),
    Multiply(f64, f64),
    Divide(f64, f64),
    Power(f64, f64),
}

impl Operation {
    fn calculate(&self) -> Result<f64, String> {
        match self {
            Operation::Add(a, b) => Ok(a + b),
            Operation::Subtract(a, b) => Ok(a - b),
            Operation::Multiply(a, b) => Ok(a * b),
            Operation::Divide(a, b) => {
                if *b != 0.0 {
                    Ok(a / b)
                } else {
                    Err("除零错误".to_string())
                }
            }
            Operation::Power(a, b) => Ok(a.powf(*b)),
        }
    }
    
    fn to_string(&self) -> String {
        match self {
            Operation::Add(a, b) => format!("{} + {}", a, b),
            Operation::Subtract(a, b) => format!("{} - {}", a, b),
            Operation::Multiply(a, b) => format!("{} × {}", a, b),
            Operation::Divide(a, b) => format!("{} ÷ {}", a, b),
            Operation::Power(a, b) => format!("{}^{}", a, b),
        }
    }
}

fn main() {
    let operations = vec![
        Operation::Add(10.0, 5.0),
        Operation::Subtract(10.0, 5.0),
        Operation::Multiply(10.0, 5.0),
        Operation::Divide(10.0, 5.0),
        Operation::Divide(10.0, 0.0),
        Operation::Power(2.0, 3.0),
    ];
    
    for op in operations {
        println!("计算: {}", op.to_string());
        match op.calculate() {
            Ok(result) => println!("结果: {}", result),
            Err(error) => println!("错误: {}", error),
        }
        println!("---");
    }
}
```

## 下一步

现在您已经掌握了结构体和枚举。接下来我们将学习集合类型，包括Vec、HashMap等。
