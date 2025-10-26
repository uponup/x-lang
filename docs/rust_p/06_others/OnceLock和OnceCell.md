# OnceLock 和 OnceCell 详解

## 一、核心概念

**延迟初始化**和**单次赋值**：创建时为空，只能赋值一次，适合全局单例和懒加载。

```rust
let cell = OnceCell::new();
cell.set(42).unwrap();      // ✅ 第一次成功
cell.set(100).unwrap_err(); // ❌ 第二次失败
```

---

## 二、三种类型对比

### 核心区别

| 特性 | `std::cell::OnceCell` | `std::sync::OnceLock` | `tokio::sync::OnceCell` |
|------|----------------------|----------------------|------------------------|
| **线程安全** | ❌ | ✅ | ✅ |
| **异步** | ❌ | ❌ | ✅ |
| **位置** | `std::cell` | `std::sync` | `tokio::sync` |
| **等待机制** | 单线程 | 阻塞线程 | yield 任务 |
| **场景** | 单线程同步 | 多线程同步 | **异步运行时** |

### 快速选择

```
需要延迟初始化？
│
├─ 在 Tokio 异步环境？
│  └─→ tokio::sync::OnceCell ✅
│
├─ 单线程同步？
│  └─→ std::cell::OnceCell
│
└─ 多线程同步？
   └─→ std::sync::OnceLock
```

---

## 三、基础用法

### 1. OnceCell（单线程）

```rust
use std::cell::OnceCell;

let cell = OnceCell::new();

// 设置
cell.set(42).unwrap();

// 获取
assert_eq!(cell.get(), Some(&42));

// 懒加载
let value = cell.get_or_init(|| {
    println!("首次初始化");
    42
});
```

### 2. OnceLock（多线程同步）

```rust
use std::sync::OnceLock;

static CONFIG: OnceLock<String> = OnceLock::new();

fn get_config() -> &'static String {
    CONFIG.get_or_init(|| {
        String::from("配置数据")
    })
}
```

### 3. Tokio OnceCell（异步）

```rust
use tokio::sync::OnceCell;

static DATA: OnceCell<String> = OnceCell::const_new();

async fn get_data() -> &'static String {
    DATA.get_or_init(|| async {
        // 异步初始化
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        String::from("异步数据")
    }).await
}
```

---

## 四、关键问题解答

### ⚠️ 问题1：线程安全 ≠ 异步

**重要**：`OnceLock` 是**线程安全**的，但**不是异步**的！

```
线程安全（Thread-Safe）
- 多个线程可以同时安全访问
- ✅ OnceLock 是线程安全的
- ✅ tokio::OnceCell 也是线程安全的

异步（Async）
- 等待时不阻塞线程，可以执行其他任务
- ❌ OnceLock 不是异步的（会阻塞）
- ✅ tokio::OnceCell 是异步的
```

### 🔥 问题2：为什么 Tokio 要重新实现？

因为 **`OnceLock` 会阻塞线程**，在异步环境中会严重影响性能！

#### 阻塞示例（OnceLock）

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    static DATA: OnceLock<String> = OnceLock::new();
    
    // 任务1：快速任务
    tokio::spawn(async {
        for i in 0..5 {
            println!("任务1: {}", i);
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    });
    
    // 任务2：使用 OnceLock
    tokio::spawn(async {
        DATA.get_or_init(|| {
            // ⚠️ 阻塞整个线程 2 秒！
            std::thread::sleep(Duration::from_secs(2));
            String::from("data")
        });
    });
    
    tokio::time::sleep(Duration::from_secs(3)).await;
}

// 输出：
// 任务1: 0
// （2秒阻塞，任务1无法执行）
// 任务1: 1
// ...
```

#### 异步示例（Tokio OnceCell）

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    static DATA: OnceCell<String> = OnceCell::const_new();
    
    // 任务1：快速任务
    tokio::spawn(async {
        for i in 0..5 {
            println!("任务1: {}", i);
            tokio::time::sleep(Duration::from_millis(100)).await;
        }
    });
    
    // 任务2：使用 Tokio OnceCell
    tokio::spawn(async {
        DATA.get_or_init(|| async {
            // ✅ 异步等待，不阻塞线程
            tokio::time::sleep(Duration::from_secs(2)).await;
            String::from("data")
        }).await;
    });
    
    tokio::time::sleep(Duration::from_secs(3)).await;
}

// 输出：
// 任务1: 0
// 任务1: 1  ← 初始化期间仍能执行！
// 任务1: 2
// ...
```

### 🚗 类比理解

**OnceLock（阻塞）**：
```
线程：[任务A等待🚗🔴.............]
      ↑ 整条路被占用，其他任务无法通行 ❌
```

**Tokio OnceCell（异步）**：
```
线程：[任务B🚗 任务C🚗 任务D🚗]
      ↑ 任务A让出道路，其他任务继续 ✅
```

### 📊 性能对比

| 场景 | OnceLock | Tokio OnceCell |
|------|----------|----------------|
| 单线程运行时 | 阻塞所有任务 | 仅等待初始化的任务暂停 |
| 多线程运行时 | 阻塞一个线程 | 不阻塞线程 |
| 100个并发请求 | 可能依次处理 | 并发处理 |

---

## 五、实战场景

### 场景1：全局配置

```rust
use std::sync::OnceLock;

#[derive(Clone)]
struct Config {
    host: String,
    port: u16,
}

static CONFIG: OnceLock<Config> = OnceLock::new();

fn get_config() -> &'static Config {
    CONFIG.get_or_init(|| Config {
        host: "localhost".to_string(),
        port: 8080,
    })
}
```

### 场景2：异步数据库连接池

```rust
use tokio::sync::OnceCell;
use sqlx::PgPool;

static DB_POOL: OnceCell<PgPool> = OnceCell::const_new();

async fn get_db_pool() -> &'static PgPool {
    DB_POOL.get_or_init(|| async {
        PgPool::connect("postgres://localhost/mydb")
            .await
            .expect("无法连接数据库")
    }).await
}

#[tokio::main]
async fn main() {
    let pool = get_db_pool().await;
    // 使用连接池
}
```

### 场景3：HTTP 客户端单例

```rust
use tokio::sync::OnceCell;
use reqwest::Client;

static HTTP_CLIENT: OnceCell<Client> = OnceCell::const_new();

async fn get_http_client() -> &'static Client {
    HTTP_CLIENT.get_or_init(|| async {
        Client::builder()
            .timeout(std::time::Duration::from_secs(30))
            .build()
            .unwrap()
    }).await
}
```

### 场景4：正则表达式缓存

```rust
use std::sync::OnceLock;
use regex::Regex;

fn email_regex() -> &'static Regex {
    static REGEX: OnceLock<Regex> = OnceLock::new();
    REGEX.get_or_init(|| {
        Regex::new(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$").unwrap()
    })
}

fn is_valid_email(email: &str) -> bool {
    email_regex().is_match(email)
}
```

---

## 六、常用方法

```rust
// 1. set - 设置值（只能一次）
cell.set(value)?;

// 2. get - 获取引用
if let Some(value) = cell.get() { }

// 3. get_or_init - 懒加载（最常用）
let value = cell.get_or_init(|| expensive_init());

// 4. get_or_try_init - 可能失败的初始化
let value = cell.get_or_try_init(|| -> Result<_, _> {
    Ok(fallible_init()?)
})?;

// 5. take - 取出值
let value = cell.take();

// 6. into_inner - 转换为 Option
let option = cell.into_inner();
```

---

## 七、最佳实践

### ✅ 推荐做法

```rust
// 1. 异步环境用 tokio::sync::OnceCell
#[tokio::main]
async fn main() {
    static DATA: OnceCell<String> = OnceCell::const_new();
    let value = DATA.get_or_init(|| async {
        fetch_from_api().await
    }).await;
}

// 2. 同步多线程用 std::sync::OnceLock
fn main() {
    static DATA: OnceLock<String> = OnceLock::new();
    let value = DATA.get_or_init(|| {
        expensive_computation()
    });
}

// 3. 单线程用 std::cell::OnceCell
fn single_thread() {
    let cell = OnceCell::new();
    cell.get_or_init(|| 42);
}
```

### ❌ 避免做法

```rust
// ❌ 不要在异步环境用 OnceLock
#[tokio::main]
async fn main() {
    static DATA: OnceLock<String> = OnceLock::new();
    
    // ⚠️ 这会阻塞 Tokio 工作线程！
    let value = DATA.get_or_init(|| {
        std::thread::sleep(Duration::from_secs(1));
        String::from("data")
    });
}

// ❌ 不要用 spawn_blocking 包装 OnceLock
// 开销大，返回值不是 &'static，不优雅
```

---

## 八、与其他方案对比

### vs lazy_static

```rust
// ❌ 旧方式：需要外部 crate
use lazy_static::lazy_static;
lazy_static! {
    static ref CONFIG: String = load_config();
}

// ✅ 新方式：标准库
use std::sync::OnceLock;
static CONFIG: OnceLock<String> = OnceLock::new();
fn get_config() -> &'static String {
    CONFIG.get_or_init(|| load_config())
}
```

**优势**：
- ✅ 标准库，无需外部依赖
- ✅ 更灵活（可运行时设置）
- ✅ 更轻量

### vs `Mutex<Option<T>>`

```rust
// ❌ 繁琐的方式
static DATA: Mutex<Option<Vec<i32>>> = Mutex::new(None);

// ✅ 简洁的方式
static DATA: OnceLock<Vec<i32>> = OnceLock::new();

// 优势：
// - 代码更简洁
// - 初始化后无锁读取（性能更好）
// - 返回 &'static 引用
```

---

## 九、总结

### 核心要点

1. **三种类型**：
   - `OnceCell` = 单线程
   - `OnceLock` = 多线程同步（会阻塞）
   - `tokio::OnceCell` = 异步（不阻塞）

2. **线程安全 ≠ 异步**：
   - `OnceLock` 是线程安全的，但会阻塞线程
   - `tokio::OnceCell` 既线程安全又异步

3. **在 Tokio 中必须用异步版本**：
   - 否则会阻塞工作线程，严重影响性能

4. **适用场景**：
   - 全局单例
   - 懒加载资源
   - 配置管理
   - 数据库连接池
   - HTTP 客户端

### 记忆口诀

- **OnceCell** = Cell 家族 = 单线程
- **OnceLock** = Lock 家族 = 多线程同步
- **tokio::OnceCell** = 异步友好 = Tokio 专用

### 使用建议

| 场景 | 推荐 |
|------|------|
| Tokio 异步代码 | `tokio::sync::OnceCell` ⭐ |
| 同步多线程 | `std::sync::OnceLock` |
| 单线程 | `std::cell::OnceCell` |


**关键教训**：在 Tokio 异步环境中，**始终使用 `tokio::sync::OnceCell`**，而不是 `std::sync::OnceLock`。这不仅是 API 选择，而是性能和正确性的关键！🚀✨
