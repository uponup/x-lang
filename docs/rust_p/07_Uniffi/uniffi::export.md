# UniFFI 详解

## 什么是 UniFFI

**UniFFI (Unified Foreign Function Interface)** 是 Mozilla 开发的一个工具，用于**自动生成 Rust 代码与其他语言（Kotlin、Swift、Python 等）之间的绑定**。

简单来说：用 Rust 写一次代码，UniFFI 自动生成让其他语言调用的接口。

## 为什么需要 UniFFI

### 传统的跨语言调用问题

```rust
// Rust 代码
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

// 需要手动为每个目标语言写绑定代码：
// - Swift: 写 C 头文件 + Swift wrapper
// - Kotlin: 写 JNI 绑定
// - Python: 写 CFFI 绑定
// 非常繁琐且容易出错！
```

### UniFFI 的解决方案

```rust
// 只需要这样写一次
#[uniffi::export]
fn add(a: i32, b: i32) -> i32 {
    a + b
}

// UniFFI 自动生成：
// ✅ Kotlin 绑定
// ✅ Swift 绑定  
// ✅ Python 绑定
// ✅ 所有必要的类型转换代码
```

## `#[uniffi::export]` 的含义

这是一个**过程宏**（procedural macro），告诉 UniFFI：

> "请为这个函数/结构体/枚举生成跨语言绑定代码"

```rust
// 标记函数可以被其他语言调用
#[uniffi::export]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// 标记结构体可以被其他语言使用
#[derive(uniffi::Record)]
pub struct User {
    pub name: String,
    pub age: u32,
}

// 标记枚举
#[derive(uniffi::Enum)]
pub enum Status {
    Active,
    Inactive,
}
```

## UniFFI 的实现原理

### 整体架构

```
┌─────────────────────────────────────────┐
│         Rust 代码 + UniFFI 属性         │
│   #[uniffi::export] fn hello() {...}   │
└──────────────────┬──────────────────────┘
                   │
                   ↓
         ┌─────────────────────┐
         │  UniFFI 构建过程    │
         │  1. 解析 UDL/宏     │
         │  2. 生成 C-FFI 层   │
         │  3. 生成绑定代码    │
         └─────────┬───────────┘
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
    ┌─────────┐         ┌─────────┐
    │ Rust库  │         │ 绑定代码 │
    │ (FFI)   │ ←────── │ 多语言   │
    └─────────┘         └─────────┘
         ↓                   ↓
    Kotlin/Swift/Python 调用
```

### 三层结构

#### 1. **Rust 核心层**
```rust
// 你写的业务逻辑
pub fn calculate_score(points: u32) -> u32 {
    points * 10
}
```

#### 2. **C-FFI 层**（UniFFI 自动生成）
```rust
// UniFFI 自动生成的 C 兼容接口
#[no_mangle]
pub extern "C" fn uniffi_mylib_fn_calculate_score(
    points: i32,
    err: &mut uniffi::ExternError,
) -> i32 {
    // 错误处理
    // 类型转换
    // 调用真正的 Rust 函数
}
```

#### 3. **目标语言绑定层**（UniFFI 自动生成）

**Kotlin:**
```kotlin
// 自动生成的 Kotlin 代码
fun calculateScore(points: UInt): UInt {
    // 调用 C-FFI 层
    // 处理错误
    // 转换类型
    return _UniFFI_mylib_calculate_score(points)
}
```

**Swift:**
```swift
// 自动生成的 Swift 代码
func calculateScore(points: UInt32) -> UInt32 {
    return try! rustCall { 
        uniffi_mylib_fn_calculate_score(points, $0) 
    }
}
```

**Python:**
```python
# 自动生成的 Python 代码
def calculate_score(points: int) -> int:
    return _uniffi_rust_call(
        _UniffiLib.uniffi_mylib_fn_calculate_score,
        points
    )
```

## 实际使用例子

### 1. 基础项目设置

```toml
# Cargo.toml
[package]
name = "mylib"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "staticlib"]  # 生成动态/静态库

[dependencies]
uniffi = "0.25"

[build-dependencies]
uniffi = { version = "0.25", features = ["build"] }
```

### 2. Rust 代码

```rust
// src/lib.rs
use uniffi;

// 导出简单函数
#[uniffi::export]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

// 导出结构体
#[derive(uniffi::Record)]
pub struct Person {
    pub name: String,
    pub age: u32,
    pub email: Option<String>,  // 支持 Option
}

#[uniffi::export]
fn create_person(name: String, age: u32) -> Person {
    Person {
        name,
        age,
        email: None,
    }
}

// 导出枚举
#[derive(uniffi::Enum)]
pub enum UserRole {
    Admin,
    User,
    Guest,
}

// 导出错误类型
#[derive(uniffi::Error)]
pub enum MyError {
    InvalidInput { message: String },
    NetworkError { code: i32 },
}

#[uniffi::export]
fn validate_age(age: u32) -> Result<bool, MyError> {
    if age < 18 {
        Err(MyError::InvalidInput {
            message: "年龄必须大于18岁".to_string(),
        })
    } else {
        Ok(true)
    }
}

// 导出类（有状态的对象）
#[derive(uniffi::Object)]
pub struct Counter {
    value: u32,
}

#[uniffi::export]
impl Counter {
    // 构造函数
    #[uniffi::constructor]
    pub fn new(initial: u32) -> Self {
        Counter { value: initial }
    }
    
    // 方法
    pub fn increment(&mut self) {
        self.value += 1;
    }
    
    pub fn get_value(&self) -> u32 {
        self.value
    }
}

// 必须：生成 UniFFI 脚手架代码
uniffi::setup_scaffolding!();
```

### 3. 构建配置

```rust
// build.rs
fn main() {
    uniffi::generate_scaffolding("src/mylib.udl").unwrap();
}
```

### 4. 在其他语言中使用

#### Kotlin (Android)
```kotlin
import mylib.*

fun main() {
    // 调用函数
    val greeting = greet("Alice")
    println(greeting)  // Hello, Alice!
    
    // 使用结构体
    val person = createPerson("Bob", 30u)
    println(person.name)  // Bob
    
    // 使用对象
    val counter = Counter(0u)
    counter.increment()
    println(counter.getValue())  // 1
    
    // 错误处理
    try {
        validateAge(15u)
    } catch (e: MyException.InvalidInput) {
        println(e.message)
    }
}
```

#### Swift (iOS)
```swift
import mylib

let greeting = greet(name: "Alice")
print(greeting)  // Hello, Alice!

let person = createPerson(name: "Bob", age: 30)
print(person.name)  // Bob

let counter = Counter(initial: 0)
counter.increment()
print(counter.getValue())  // 1

// 错误处理
do {
    try validateAge(age: 15)
} catch MyError.InvalidInput(let message) {
    print(message)
}
```

#### Python
```python
from mylib import greet, create_person, Counter, validate_age, MyError

# 调用函数
greeting = greet("Alice")
print(greeting)  # Hello, Alice!

# 使用结构体
person = create_person("Bob", 30)
print(person.name)  # Bob

# 使用对象
counter = Counter(0)
counter.increment()
print(counter.get_value())  # 1

# 错误处理
try:
    validate_age(15)
except MyError.InvalidInput as e:
    print(e.message)
```

## UniFFI 的核心技术

### 1. **类型映射**

| Rust 类型 | Kotlin | Swift | Python |
|-----------|--------|-------|--------|
| `u32` | `UInt` | `UInt32` | `int` |
| `String` | `String` | `String` | `str` |
| `Vec<T>` | `List<T>` | `[T]` | `list[T]` |
| `Option<T>` | `T?` | `T?` | `Optional[T]` |
| `Result<T, E>` | 抛异常 | 抛异常 | 抛异常 |

### 2. **内存管理**

```rust
// Rust 对象通过引用计数在跨语言边界传递
#[derive(uniffi::Object)]
pub struct MyObject { /* ... */ }

// Kotlin/Swift/Python 会持有一个指针
// UniFFI 自动管理生命周期
// 当外部对象被 GC 回收时，通知 Rust 释放内存
```

### 3. **错误传播**

```rust
// Rust 的 Result 自动转换为目标语言的异常
#[uniffi::export]
fn may_fail() -> Result<String, MyError> {
    Err(MyError::NetworkError { code: 404 })
}

// Kotlin: 变成 try-catch
// Swift: 变成 do-try-catch  
// Python: 变成 try-except
```

## UniFFI vs 其他方案

| 方案 | 优点 | 缺点 |
|------|------|------|
| **UniFFI** | ✅ 自动生成多语言绑定<br>✅ 类型安全<br>✅ 易于使用 | ❌ 仅支持部分语言<br>❌ 有性能开销 |
| **手写 FFI** | ✅ 最大性能<br>✅ 完全控制 | ❌ 极其繁琐<br>❌ 容易出错 |
| **JNI (Java)** | ✅ 官方支持 | ❌ 只支持 Java/Kotlin<br>❌ 代码冗长 |
| **wasm-bindgen** | ✅ Web 支持好 | ❌ 只支持 WebAssembly |

## 实际应用场景

### 1. **移动应用共享核心逻辑**
```
         Rust 核心库
              │
    ┌─────────┴─────────┐
    ↓                   ↓
Android App         iOS App
(Kotlin)           (Swift)
```

### 2. **Python 加速**
```python
# CPU 密集型任务用 Rust 实现
# 从 Python 调用获得原生性能
import mylib
result = mylib.heavy_computation(data)
```

### 3. **跨平台 CLI 工具**
```
Rust 核心
  │
  ├─→ 直接编译为可执行文件
  ├─→ Python 绑定（pip 安装）
  └─→ Node.js 绑定（npm 安装）
```

## 实战项目示例：密码管理器

```rust
use uniffi;

#[derive(uniffi::Record)]
pub struct Credential {
    pub username: String,
    pub encrypted_password: Vec<u8>,
    pub website: String,
}

#[derive(uniffi::Object)]
pub struct PasswordManager {
    credentials: Vec<Credential>,
}

#[uniffi::export]
impl PasswordManager {
    #[uniffi::constructor]
    pub fn new() -> Self {
        PasswordManager {
            credentials: Vec::new(),
        }
    }
    
    pub fn add_credential(&mut self, cred: Credential) {
        self.credentials.push(cred);
    }
    
    pub fn get_all(&self) -> Vec<Credential> {
        self.credentials.clone()
    }
}

uniffi::setup_scaffolding!();
```

然后在 iOS、Android、Python 中都可以使用同样的密码管理逻辑！

## 总结

**UniFFI** 让你能够：
- 🦀 用 Rust 写核心逻辑（安全、高性能）
- 📱 在多个平台复用同一份代码
- 🔄 自动生成类型安全的绑定
- ⚡ 减少跨语言调用的样板代码