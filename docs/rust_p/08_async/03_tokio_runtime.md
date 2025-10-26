# Tokio Runtime 详解

## 什么是 Runtime

**Runtime（运行时）**是 Tokio 的核心，负责执行异步任务、调度、I/O 事件处理等。

```
Runtime = 任务调度器 + 线程池 + I/O 驱动 + 定时器
```

## 创建 Runtime

### 方式 1：使用宏（推荐）

```rust
// 自动创建多线程运行时
#[tokio::main]
async fn main() {
    println!("Hello from Tokio!");
}

// 等价于：
fn main() {
    tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(async {
            println!("Hello from Tokio!");
        })
}
```

### 方式 2：手动创建

```rust
use tokio::runtime::Runtime;

fn main() {
    // 创建运行时
    let rt = Runtime::new().unwrap();
    
    // 运行异步代码
    rt.block_on(async {
        println!("Hello from manual runtime!");
    });
}
```

### 方式 3：使用 Builder

```rust
use tokio::runtime::Builder;

fn main() {
    let rt = Builder::new_multi_thread()
        .worker_threads(4)          // 4 个工作线程
        .thread_name("my-pool")     // 线程名称
        .thread_stack_size(3 * 1024 * 1024)  // 栈大小
        .enable_all()               // 启用所有功能
        .build()
        .unwrap();
    
    rt.block_on(async {
        println!("Hello from custom runtime!");
    });
}
```

## Runtime 类型

### 1. 多线程 Runtime（默认）

```rust
#[tokio::main]  // 默认多线程
async fn main() {
    // 适合：I/O 密集型 + CPU 密集型混合
}

// 或显式指定
#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // 使用 4 个工作线程
}
```

**特点**：
- ✅ 可以充分利用多核 CPU
- ✅ 适合混合工作负载
- ❌ 稍微复杂，有线程切换开销

### 2. 单线程 Runtime

```rust
#[tokio::main(flavor = "current_thread")]
async fn main() {
    // 所有任务在当前线程上运行
}
```

**特点**：
- ✅ 简单，无线程切换开销
- ✅ 适合纯 I/O 密集型
- ❌ 无法利用多核

### 对比

```rust
use tokio::time::{sleep, Duration, Instant};

#[tokio::main(flavor = "multi_thread")]
async fn multi_thread_demo() {
    let start = Instant::now();
    
    let handles: Vec<_> = (0..4)
        .map(|i| {
            tokio::spawn(async move {
                // CPU 密集型任务
                let sum: u64 = (0..100_000_000).sum();
                println!("任务 {} 完成", i);
            })
        })
        .collect();
    
    for handle in handles {
        handle.await.unwrap();
    }
    
    println!("多线程耗时: {:?}", start.elapsed());
    // 多核并行，快！
}

#[tokio::main(flavor = "current_thread")]
async fn single_thread_demo() {
    let start = Instant::now();
    
    for i in 0..4 {
        tokio::spawn(async move {
            let sum: u64 = (0..100_000_000).sum();
            println!("任务 {} 完成", i);
        }).await.unwrap();
    }
    
    println!("单线程耗时: {:?}", start.elapsed());
    // 串行执行，慢
}
```

## Runtime 配置

### 工作线程数

```rust
use tokio::runtime::Builder;

fn main() {
    // 自动设置（CPU 核心数）
    let rt1 = Builder::new_multi_thread()
        .build()
        .unwrap();
    
    // 手动设置
    let rt2 = Builder::new_multi_thread()
        .worker_threads(8)
        .build()
        .unwrap();
    
    // 获取 CPU 核心数
    let cores = num_cpus::get();
    let rt3 = Builder::new_multi_thread()
        .worker_threads(cores * 2)
        .build()
        .unwrap();
}
```

### 线程命名

```rust
use tokio::runtime::Builder;

fn main() {
    let rt = Builder::new_multi_thread()
        .thread_name("my-worker")
        .thread_name_fn(|| {
            static ATOMIC_ID: std::sync::atomic::AtomicUsize = 
                std::sync::atomic::AtomicUsize::new(0);
            let id = ATOMIC_ID.fetch_add(1, std::sync::atomic::Ordering::SeqCst);
            format!("worker-{}", id)
        })
        .build()
        .unwrap();
}
```

### 启用特性

```rust
use tokio::runtime::Builder;

fn main() {
    let rt = Builder::new_multi_thread()
        .enable_all()       // 启用所有特性
        .build()
        .unwrap();
    
    // 或者选择性启用
    let rt = Builder::new_multi_thread()
        .enable_io()        // 启用 I/O
        .enable_time()      // 启用定时器
        .build()
        .unwrap();
}
```

## Runtime 方法

### block_on - 阻塞执行

```rust
use tokio::runtime::Runtime;

fn main() {
    let rt = Runtime::new().unwrap();
    
    // 阻塞当前线程直到异步代码完成
    let result = rt.block_on(async {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        "完成"
    });
    
    println!("结果: {}", result);
}
```

### spawn - 创建任务

```rust
use tokio::runtime::Runtime;

fn main() {
    let rt = Runtime::new().unwrap();
    
    rt.block_on(async {
        // 在 runtime 上创建任务
        let handle = tokio::spawn(async {
            println!("异步任务");
        });
        
        handle.await.unwrap();
    });
}
```

### spawn_blocking - CPU 密集型任务

```rust
#[tokio::main]
async fn main() {
    // 在专门的阻塞线程池中运行
    let result = tokio::task::spawn_blocking(|| {
        // CPU 密集型计算
        let sum: u64 = (0..1_000_000_000).sum();
        sum
    }).await.unwrap();
    
    println!("计算结果: {}", result);
}
```

## Runtime Handle

**Handle** 是 Runtime 的句柄，可以在任何地方使用。

```rust
use tokio::runtime::Handle;

#[tokio::main]
async fn main() {
    // 获取当前 runtime 的 handle
    let handle = Handle::current();
    
    // 在其他线程中使用
    std::thread::spawn(move || {
        handle.spawn(async {
            println!("从其他线程创建的任务");
        });
    }).join().unwrap();
    
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
}
```

### 多个 Runtime

```rust
use tokio::runtime::Runtime;

fn main() {
    // 创建两个独立的 runtime
    let rt1 = Runtime::new().unwrap();
    let rt2 = Runtime::new().unwrap();
    
    // 在 rt1 上运行
    let handle1 = rt1.spawn(async {
        println!("Runtime 1");
    });
    
    // 在 rt2 上运行
    let handle2 = rt2.spawn(async {
        println!("Runtime 2");
    });
    
    rt1.block_on(handle1).unwrap();
    rt2.block_on(handle2).unwrap();
}
```

## 任务调度

### Work Stealing（工作窃取）

```rust
// Tokio 使用工作窃取算法
// 
// 线程 1: [Task A] [Task B] [Task C]
// 线程 2: [Task D]
//                    ↓
// 线程 2 空闲时会从线程 1 偷取任务：
// 线程 1: [Task A] [Task B]
// 线程 2: [Task D] [Task C] ← 窃取

#[tokio::main]
async fn main() {
    for i in 0..100 {
        tokio::spawn(async move {
            println!("任务 {}", i);
        });
    }
    
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
}
```

### 任务优先级

```rust
#[tokio::main]
async fn main() {
    // Tokio 没有内置优先级
    // 但可以通过设计模式实现：
    
    // 高优先级任务：立即 spawn
    tokio::spawn(async {
        println!("高优先级任务");
    });
    
    // 低优先级任务：使用 channel 排队
    let (tx, mut rx) = tokio::sync::mpsc::channel(100);
    
    // 生产者
    tokio::spawn(async move {
        for i in 0..10 {
            tx.send(i).await.unwrap();
        }
    });
    
    // 消费者（控制并发）
    while let Some(task) = rx.recv().await {
        tokio::spawn(async move {
            println!("低优先级任务 {}", task);
        });
    }
}
```

## Runtime 生命周期

### Shutdown

```rust
use tokio::runtime::Runtime;
use tokio::time::{sleep, Duration};

fn main() {
    let rt = Runtime::new().unwrap();
    
    let handle = rt.spawn(async {
        loop {
            println!("工作中...");
            sleep(Duration::from_secs(1)).await;
        }
    });
    
    // 运行一段时间
    std::thread::sleep(Duration::from_secs(3));
    
    // 取消任务
    handle.abort();
    
    // 关闭 runtime
    rt.shutdown_timeout(Duration::from_secs(5));
    println!("Runtime 已关闭");
}
```

### Graceful Shutdown

```rust
use tokio::sync::mpsc;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let (shutdown_tx, mut shutdown_rx) = mpsc::channel(1);
    
    // 工作任务
    let worker = tokio::spawn(async move {
        loop {
            tokio::select! {
                _ = shutdown_rx.recv() => {
                    println!("收到关闭信号，清理中...");
                    // 清理资源
                    sleep(Duration::from_secs(1)).await;
                    println!("清理完成");
                    break;
                }
                _ = sleep(Duration::from_secs(1)) => {
                    println!("工作中...");
                }
            }
        }
    });
    
    // 模拟运行
    sleep(Duration::from_secs(3)).await;
    
    // 发送关闭信号
    shutdown_tx.send(()).await.unwrap();
    
    // 等待任务完成
    worker.await.unwrap();
    println!("程序退出");
}
```

## 性能调优

### 1. 选择合适的 Runtime

```rust
// ✅ I/O 密集型 → 单线程
#[tokio::main(flavor = "current_thread")]
async fn io_intensive() {
    // 数据库查询、网络请求等
}

// ✅ CPU + I/O 混合 → 多线程
#[tokio::main(flavor = "multi_thread")]
async fn mixed_workload() {
    // 既有计算又有 I/O
}
```

### 2. 合理设置工作线程数

```rust
use tokio::runtime::Builder;

fn main() {
    // I/O 密集：CPU 核心数
    let rt = Builder::new_multi_thread()
        .worker_threads(num_cpus::get())
        .build()
        .unwrap();
    
    // CPU 密集：CPU 核心数
    let rt = Builder::new_multi_thread()
        .worker_threads(num_cpus::get())
        .build()
        .unwrap();
    
    // 混合：CPU 核心数 * 2
    let rt = Builder::new_multi_thread()
        .worker_threads(num_cpus::get() * 2)
        .build()
        .unwrap();
}
```

### 3. 使用 spawn_blocking 处理阻塞操作

```rust
#[tokio::main]
async fn main() {
    // ❌ 错误：阻塞整个运行时
    // let data = std::fs::read_to_string("file.txt").unwrap();
    
    // ✅ 正确：使用 spawn_blocking
    let data = tokio::task::spawn_blocking(|| {
        std::fs::read_to_string("file.txt").unwrap()
    }).await.unwrap();
    
    println!("数据: {}", data);
}
```

### 4. 避免任务过多

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

#[tokio::main]
async fn main() {
    // ❌ 创建百万个任务会耗尽内存
    // for i in 0..1_000_000 {
    //     tokio::spawn(async move { /* ... */ });
    // }
    
    // ✅ 使用信号量限制并发
    let semaphore = Arc::new(Semaphore::new(100));  // 最多 100 个并发
    
    for i in 0..1_000_000 {
        let permit = semaphore.clone().acquire_owned().await.unwrap();
        tokio::spawn(async move {
            // 做一些工作
            drop(permit);  // 释放许可
        });
    }
}
```

## 监控和调试

### 获取 Runtime 信息

```rust
#[tokio::main]
async fn main() {
    let handle = tokio::runtime::Handle::current();
    
    // 获取指标（需要 unstable features）
    // let metrics = handle.metrics();
    
    println!("工作线程数: {}", num_cpus::get());
}
```

### Console 监控（需要 tokio-console）

```toml
[dependencies]
tokio = { version = "1", features = ["full", "tracing"] }
console-subscriber = "0.2"
```

```rust
fn main() {
    console_subscriber::init();
    
    let rt = tokio::runtime::Runtime::new().unwrap();
    rt.block_on(async {
        // 你的异步代码
    });
}
```

然后运行 `tokio-console` 查看实时监控。

## 常见陷阱

### 1. 在 Runtime 外调用 block_on

```rust
#[tokio::main]
async fn main() {
    // ❌ 错误：在异步上下文中调用 block_on 会死锁
    // let rt = Runtime::new().unwrap();
    // rt.block_on(async { /* ... */ });
    
    // ✅ 正确：直接使用 await
    async_function().await;
}

async fn async_function() {
    println!("异步函数");
}
```

### 2. 忘记 await

```rust
#[tokio::main]
async fn main() {
    // ❌ 错误：任务不会执行
    tokio::spawn(async {
        println!("这不会打印");
    });
    
    // ✅ 正确：等待任务完成
    tokio::spawn(async {
        println!("这会打印");
    }).await.unwrap();
}
```

### 3. 阻塞 Runtime

```rust
#[tokio::main]
async fn main() {
    // ❌ 错误：阻塞操作会阻塞整个线程
    for i in 0..10 {
        std::thread::sleep(std::time::Duration::from_secs(1));  // 阻塞！
        println!("{}", i);
    }
    
    // ✅ 正确：使用异步 sleep
    for i in 0..10 {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        println!("{}", i);
    }
}
```

## 最佳实践

1. **选择合适的 Runtime 类型**
   - 纯 I/O → 单线程
   - 混合负载 → 多线程

2. **合理配置线程数**
   - 不要盲目增加
   - 监控性能指标

3. **隔离阻塞操作**
   - 使用 `spawn_blocking`
   - 或使用专门的线程池

4. **限制并发任务数**
   - 使用信号量
   - 避免创建过多任务

5. **正确关闭**
   - 优雅地关闭任务
   - 清理资源

## 总结

**Tokio Runtime** 是异步程序的引擎：

- 🏗️ **类型**：单线程或多线程
- ⚙️ **配置**：可定制线程数、特性等
- 📊 **调度**：工作窃取算法
- 🛠️ **工具**：spawn、spawn_blocking、Handle

掌握 Runtime 的使用是编写高性能 Tokio 应用的关键！🚀

