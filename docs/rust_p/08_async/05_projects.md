# Tokio 实战项目

## 项目 1：异步 HTTP 服务器

创建一个简单但功能完整的异步 HTTP 服务器。

### 依赖配置

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
axum = "0.7"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 完整代码

```rust
use axum::{
    routing::{get, post},
    Router,
    Json,
    extract::{Path, State},
    response::IntoResponse,
    http::StatusCode,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::Mutex;
use std::collections::HashMap;

// 数据模型
#[derive(Debug, Clone, Serialize, Deserialize)]
struct User {
    id: u64,
    name: String,
    email: String,
}

// 应用状态
#[derive(Clone)]
struct AppState {
    users: Arc<Mutex<HashMap<u64, User>>>,
}

// API 处理器
async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<User>,
) -> (StatusCode, Json<User>) {
    let mut users = state.users.lock().await;
    users.insert(payload.id, payload.clone());
    (StatusCode::CREATED, Json(payload))
}

async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<Json<User>, StatusCode> {
    let users = state.users.lock().await;
    users
        .get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

async fn list_users(
    State(state): State<AppState>,
) -> Json<Vec<User>> {
    let users = state.users.lock().await;
    let user_list: Vec<User> = users.values().cloned().collect();
    Json(user_list)
}

async fn health_check() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() {
    // 初始化状态
    let state = AppState {
        users: Arc::new(Mutex::new(HashMap::new())),
    };

    // 构建路由
    let app = Router::new()
        .route("/", get(|| async { "Welcome to User API!" }))
        .route("/health", get(health_check))
        .route("/users", get(list_users).post(create_user))
        .route("/users/:id", get(get_user))
        .with_state(state);

    // 启动服务器
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    
    println!("🚀 服务器运行在 http://127.0.0.1:3000");
    
    axum::serve(listener, app).await.unwrap();
}
```

### 测试 API

```bash
# 创建用户
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"id":1,"name":"Alice","email":"alice@example.com"}'

# 获取用户
curl http://localhost:3000/users/1

# 列出所有用户
curl http://localhost:3000/users

# 健康检查
curl http://localhost:3000/health
```

---

## 项目 2：并发文件处理器

处理多个文件并发读取、处理和写入。

### 代码

```rust
use tokio::fs;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::path::Path;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 要处理的文件列表
    let files = vec!["file1.txt", "file2.txt", "file3.txt"];
    
    // 并发处理所有文件
    let handles: Vec<_> = files
        .into_iter()
        .map(|filename| {
            tokio::spawn(async move {
                process_file(filename).await
            })
        })
        .collect();
    
    // 等待所有任务完成
    for handle in handles {
        match handle.await {
            Ok(Ok(())) => println!("✅ 文件处理成功"),
            Ok(Err(e)) => eprintln!("❌ 错误: {}", e),
            Err(e) => eprintln!("❌ 任务失败: {}", e),
        }
    }
    
    Ok(())
}

async fn process_file(filename: &str) -> Result<(), Box<dyn std::error::Error>> {
    println!("📖 读取文件: {}", filename);
    
    // 读取文件
    let mut file = fs::File::open(filename).await?;
    let mut contents = String::new();
    file.read_to_string(&mut contents).await?;
    
    // 处理内容（转换为大写）
    let processed = contents.to_uppercase();
    
    // 写入新文件
    let output_filename = format!("processed_{}", filename);
    let mut output_file = fs::File::create(&output_filename).await?;
    output_file.write_all(processed.as_bytes()).await?;
    
    println!("✅ 完成: {} -> {}", filename, output_filename);
    
    Ok(())
}
```

---

## 项目 3：WebSocket 聊天服务器

实时聊天服务器，支持多个客户端。

### 依赖

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
tokio-tungstenite = "0.21"
futures = "0.3"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 代码

```rust
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::broadcast;
use tokio_tungstenite::{accept_async, tungstenite::Message};
use futures::{StreamExt, SinkExt};

#[tokio::main]
async fn main() {
    // 创建广播通道
    let (tx, _rx) = broadcast::channel::<String>(100);
    
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();
    println!("💬 聊天服务器运行在 ws://127.0.0.1:8080");
    
    while let Ok((stream, addr)) = listener.accept().await {
        println!("🔗 新连接: {}", addr);
        let tx = tx.clone();
        let rx = tx.subscribe();
        
        tokio::spawn(handle_connection(stream, tx, rx));
    }
}

async fn handle_connection(
    stream: TcpStream,
    tx: broadcast::Sender<String>,
    mut rx: broadcast::Receiver<String>,
) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            eprintln!("❌ WebSocket 握手失败: {}", e);
            return;
        }
    };
    
    let (mut write, mut read) = ws_stream.split();
    
    // 接收消息并广播
    let tx_clone = tx.clone();
    let mut read_task = tokio::spawn(async move {
        while let Some(msg) = read.next().await {
            if let Ok(msg) = msg {
                if let Message::Text(text) = msg {
                    println!("📩 收到消息: {}", text);
                    let _ = tx_clone.send(text);
                }
            }
        }
    });
    
    // 接收广播并发送给客户端
    let mut write_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if write.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });
    
    // 等待任一任务完成
    tokio::select! {
        _ = &mut read_task => write_task.abort(),
        _ = &mut write_task => read_task.abort(),
    }
    
    println!("🔌 连接断开");
}
```

### 测试客户端

```html
<!-- chat.html -->
<!DOCTYPE html>
<html>
<head>
    <title>聊天室</title>
</head>
<body>
    <div id="messages"></div>
    <input id="input" type="text" placeholder="输入消息...">
    <button onclick="send()">发送</button>

    <script>
        const ws = new WebSocket('ws://localhost:8080');
        
        ws.onmessage = (event) => {
            const div = document.createElement('div');
            div.textContent = event.data;
            document.getElementById('messages').appendChild(div);
        };
        
        function send() {
            const input = document.getElementById('input');
            ws.send(input.value);
            input.value = '';
        }
        
        document.getElementById('input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') send();
        });
    </script>
</body>
</html>
```

---

## 项目 4：数据库连接池

使用 Tokio 管理数据库连接。

### 依赖

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres"] }
serde = { version = "1", features = ["derive"] }
```

### 代码

```rust
use sqlx::{PgPool, FromRow};
use serde::{Deserialize, Serialize};

#[derive(Debug, FromRow, Serialize, Deserialize)]
struct User {
    id: i32,
    name: String,
    email: String,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    // 创建连接池
    let pool = PgPool::connect("postgres://user:pass@localhost/mydb").await?;
    
    // 创建表
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )"
    )
    .execute(&pool)
    .await?;
    
    // 插入数据
    insert_user(&pool, "Alice", "alice@example.com").await?;
    insert_user(&pool, "Bob", "bob@example.com").await?;
    
    // 查询数据
    let users = get_all_users(&pool).await?;
    println!("用户列表:");
    for user in users {
        println!("  {} - {} ({})", user.id, user.name, user.email);
    }
    
    Ok(())
}

async fn insert_user(pool: &PgPool, name: &str, email: &str) -> Result<(), sqlx::Error> {
    sqlx::query("INSERT INTO users (name, email) VALUES ($1, $2)")
        .bind(name)
        .bind(email)
        .execute(pool)
        .await?;
    println!("✅ 插入用户: {}", name);
    Ok(())
}

async fn get_all_users(pool: &PgPool) -> Result<Vec<User>, sqlx::Error> {
    let users = sqlx::query_as::<_, User>("SELECT id, name, email FROM users")
        .fetch_all(pool)
        .await?;
    Ok(users)
}
```

---

## 项目 5：定时任务调度器

定期执行任务的调度器。

### 代码

```rust
use tokio::time::{interval, Duration, sleep};
use std::sync::Arc;
use tokio::sync::RwLock;

struct Task {
    name: String,
    interval: Duration,
    last_run: Option<std::time::Instant>,
}

struct Scheduler {
    tasks: Arc<RwLock<Vec<Task>>>,
}

impl Scheduler {
    fn new() -> Self {
        Self {
            tasks: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    async fn add_task(&self, name: String, interval: Duration) {
        let task = Task {
            name,
            interval,
            last_run: None,
        };
        self.tasks.write().await.push(task);
    }
    
    async fn run(&self) {
        let mut interval = interval(Duration::from_secs(1));
        
        loop {
            interval.tick().await;
            
            let mut tasks = self.tasks.write().await;
            let now = std::time::Instant::now();
            
            for task in tasks.iter_mut() {
                let should_run = task.last_run
                    .map(|last| now.duration_since(last) >= task.interval)
                    .unwrap_or(true);
                
                if should_run {
                    println!("🔄 执行任务: {}", task.name);
                    task.last_run = Some(now);
                    
                    // 在这里执行实际任务
                    let task_name = task.name.clone();
                    tokio::spawn(async move {
                        execute_task(&task_name).await;
                    });
                }
            }
        }
    }
}

async fn execute_task(name: &str) {
    println!("⏱️  任务 '{}' 开始执行", name);
    sleep(Duration::from_secs(2)).await; // 模拟工作
    println!("✅ 任务 '{}' 完成", name);
}

#[tokio::main]
async fn main() {
    let scheduler = Scheduler::new();
    
    // 添加任务
    scheduler.add_task("备份数据库".to_string(), Duration::from_secs(5)).await;
    scheduler.add_task("清理缓存".to_string(), Duration::from_secs(10)).await;
    scheduler.add_task("发送邮件".to_string(), Duration::from_secs(15)).await;
    
    println!("📅 调度器启动...");
    
    // 运行调度器
    scheduler.run().await;
}
```

---

## 项目 6：并发 API 请求聚合器

同时请求多个 API 并聚合结果。

### 依赖

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
```

### 代码

```rust
use reqwest;
use serde::{Deserialize, Serialize};
use tokio::time::{timeout, Duration};

#[derive(Debug, Serialize, Deserialize)]
struct ApiResponse {
    source: String,
    data: serde_json::Value,
    duration_ms: u128,
}

#[derive(Debug)]
struct AggregatedResult {
    responses: Vec<ApiResponse>,
    total_time_ms: u128,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let start = std::time::Instant::now();
    
    // API 端点列表
    let endpoints = vec![
        ("GitHub", "https://api.github.com"),
        ("JSONPlaceholder", "https://jsonplaceholder.typicode.com/users/1"),
        ("RandomUser", "https://randomuser.me/api/"),
    ];
    
    // 并发请求所有 API
    let handles: Vec<_> = endpoints
        .into_iter()
        .map(|(name, url)| {
            tokio::spawn(fetch_api(name.to_string(), url.to_string()))
        })
        .collect();
    
    // 收集结果
    let mut responses = Vec::new();
    for handle in handles {
        match handle.await {
            Ok(Ok(response)) => responses.push(response),
            Ok(Err(e)) => eprintln!("❌ API 请求失败: {}", e),
            Err(e) => eprintln!("❌ 任务失败: {}", e),
        }
    }
    
    let result = AggregatedResult {
        responses,
        total_time_ms: start.elapsed().as_millis(),
    };
    
    // 打印结果
    println!("\n📊 聚合结果:");
    println!("总耗时: {}ms", result.total_time_ms);
    println!("\n各 API 响应:");
    for response in result.responses {
        println!("  {} - {}ms", response.source, response.duration_ms);
    }
    
    Ok(())
}

async fn fetch_api(
    name: String,
    url: String,
) -> Result<ApiResponse, Box<dyn std::error::Error>> {
    let start = std::time::Instant::now();
    
    println!("🌐 请求 {} ...", name);
    
    // 设置超时
    let result = timeout(Duration::from_secs(5), async {
        let response = reqwest::get(&url).await?;
        let data: serde_json::Value = response.json().await?;
        Ok::<_, Box<dyn std::error::Error>>(data)
    })
    .await??;
    
    let duration = start.elapsed();
    
    println!("✅ {} 响应完成 ({}ms)", name, duration.as_millis());
    
    Ok(ApiResponse {
        source: name,
        data: result,
        duration_ms: duration.as_millis(),
    })
}
```

---

## 最佳实践总结

### 1. 错误处理

```rust
use anyhow::Result;

#[tokio::main]
async fn main() -> Result<()> {
    let result = risky_operation().await?;
    Ok(())
}

async fn risky_operation() -> Result<String> {
    // 使用 ? 传播错误
    let data = fetch_data().await?;
    Ok(data)
}
```

### 2. 超时控制

```rust
use tokio::time::{timeout, Duration};

async fn with_timeout() {
    match timeout(Duration::from_secs(5), long_operation()).await {
        Ok(result) => println!("成功: {:?}", result),
        Err(_) => println!("超时！"),
    }
}
```

### 3. 优雅关闭

```rust
use tokio::signal;

#[tokio::main]
async fn main() {
    tokio::select! {
        _ = signal::ctrl_c() => {
            println!("收到 Ctrl+C，正在关闭...");
            // 清理资源
        }
    }
}
```

### 4. 限制并发

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;

async fn limited_concurrency() {
    let semaphore = Arc::new(Semaphore::new(10)); // 最多 10 个并发
    
    for i in 0..100 {
        let permit = semaphore.clone().acquire_owned().await.unwrap();
        tokio::spawn(async move {
            // 执行任务
            drop(permit); // 释放
        });
    }
}
```

## 总结

通过这些实战项目，你已经掌握了：

- ✅ 构建异步 Web 服务器
- ✅ 并发文件处理
- ✅ WebSocket 实时通信
- ✅ 数据库连接池管理
- ✅ 定时任务调度
- ✅ API 请求聚合

继续实践，你会越来越熟练！🚀🦀

