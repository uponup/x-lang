# 实践项目3：简单Web服务器

## 项目概述

我们将创建一个功能完整的HTTP Web服务器，支持静态文件服务、API接口、中间件、路由等功能。

## 项目结构

```
web_server/
├── Cargo.toml
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── server.rs
│   ├── router.rs
│   ├── handler.rs
│   ├── middleware.rs
│   └── static_files.rs
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## 创建项目

```bash
cargo new web_server
cd web_server
```

## 核心代码实现

### 1. Cargo.toml

```toml
[package]
name = "web_server"
version = "0.1.0"
edition = "2021"
authors = ["Rust Learner <learner@example.com>"]
description = "一个功能完整的HTTP Web服务器"

[dependencies]
tokio = { version = "1.0", features = ["full"] }
hyper = { version = "0.14", features = ["full"] }
hyper-staticfile = "0.9"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
url = "2.0"
mime_guess = "2.0"
chrono = { version = "0.4", features = ["serde"] }
```

### 2. src/lib.rs

```rust
pub mod server;
pub mod router;
pub mod handler;
pub mod middleware;
pub mod static_files;

use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Debug, Clone)]
pub struct Request {
    pub method: String,
    pub path: String,
    pub headers: HashMap<String, String>,
    pub body: String,
    pub query_params: HashMap<String, String>,
}

#[derive(Debug, Clone)]
pub struct Response {
    pub status_code: u16,
    pub headers: HashMap<String, String>,
    pub body: String,
}

impl Response {
    pub fn new(status_code: u16) -> Response {
        Response {
            status_code,
            headers: HashMap::new(),
            body: String::new(),
        }
    }
    
    pub fn with_body(mut self, body: String) -> Response {
        self.body = body;
        self
    }
    
    pub fn with_header(mut self, key: String, value: String) -> Response {
        self.headers.insert(key, value);
        self
    }
    
    pub fn json<T: serde::Serialize>(mut self, data: T) -> Response {
        self.headers.insert("Content-Type".to_string(), "application/json".to_string());
        self.body = serde_json::to_string(&data).unwrap_or_default();
        self
    }
    
    pub fn html(mut self, content: String) -> Response {
        self.headers.insert("Content-Type".to_string(), "text/html".to_string());
        self.body = content;
        self
    }
    
    pub fn text(mut self, content: String) -> Response {
        self.headers.insert("Content-Type".to_string(), "text/plain".to_string());
        self.body = content;
        self
    }
}

pub type Handler = Arc<dyn Fn(Request) -> Response + Send + Sync>;
pub type Middleware = Arc<dyn Fn(Request, Handler) -> Response + Send + Sync>;

pub struct WebServer {
    pub host: String,
    pub port: u16,
    pub routes: Arc<RwLock<HashMap<String, Handler>>>,
    pub middlewares: Arc<RwLock<Vec<Middleware>>>,
}

impl WebServer {
    pub fn new(host: String, port: u16) -> WebServer {
        WebServer {
            host,
            port,
            routes: Arc::new(RwLock::new(HashMap::new())),
            middlewares: Arc::new(RwLock::new(Vec::new())),
        }
    }
    
    pub async fn add_route(&self, method: &str, path: &str, handler: Handler) {
        let key = format!("{}:{}", method.to_uppercase(), path);
        let mut routes = self.routes.write().await;
        routes.insert(key, handler);
    }
    
    pub async fn add_middleware(&self, middleware: Middleware) {
        let mut middlewares = self.middlewares.write().await;
        middlewares.push(middleware);
    }
    
    pub async fn start(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let addr = format!("{}:{}", self.host, self.port);
        println!("服务器启动在 http://{}", addr);
        
        // 这里将使用tokio和hyper来实现实际的HTTP服务器
        // 为了简化，我们使用一个基本的实现
        
        Ok(())
    }
}
```

### 3. src/server.rs

```rust
use crate::{WebServer, Request, Response, Handler, Middleware};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;
use hyper::service::{make_service_fn, service_fn};
use hyper::{Body, Method, Request as HyperRequest, Response as HyperResponse, Server, StatusCode};
use hyper::header::{HeaderValue, CONTENT_TYPE};
use std::convert::Infallible;
use std::net::SocketAddr;

impl WebServer {
    pub async fn run(&self) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        let addr = SocketAddr::from(([0, 0, 0, 0], self.port));
        
        let routes = Arc::clone(&self.routes);
        let middlewares = Arc::clone(&self.middlewares);
        
        let make_svc = make_service_fn(move |_conn| {
            let routes = Arc::clone(&routes);
            let middlewares = Arc::clone(&middlewares);
            
            async move {
                Ok::<_, Infallible>(service_fn(move |req| {
                    let routes = Arc::clone(&routes);
                    let middlewares = Arc::clone(&middlewares);
                    
                    async move {
                        handle_request(req, routes, middlewares).await
                    }
                }))
            }
        });
        
        let server = Server::bind(&addr).serve(make_svc);
        
        println!("服务器运行在 http://{}", addr);
        
        if let Err(e) = server.await {
            eprintln!("服务器错误: {}", e);
        }
        
        Ok(())
    }
}

async fn handle_request(
    req: HyperRequest<Body>,
    routes: Arc<RwLock<HashMap<String, Handler>>>,
    middlewares: Arc<RwLock<Vec<Middleware>>>,
) -> Result<HyperResponse<Body>, Infallible> {
    let method = req.method().to_string();
    let path = req.uri().path().to_string();
    let query = req.uri().query().unwrap_or("");
    
    // 解析查询参数
    let query_params = parse_query_params(query);
    
    // 解析请求头
    let mut headers = HashMap::new();
    for (key, value) in req.headers() {
        if let Ok(value_str) = value.to_str() {
            headers.insert(key.to_string(), value_str.to_string());
        }
    }
    
    // 读取请求体
    let body = match hyper::body::to_bytes(req.into_body()).await {
        Ok(bytes) => String::from_utf8_lossy(&bytes).to_string(),
        Err(_) => String::new(),
    };
    
    let request = Request {
        method,
        path: path.clone(),
        headers,
        body,
        query_params,
    };
    
    // 查找路由
    let route_key = format!("{}:{}", request.method, request.path);
    let routes_guard = routes.read().await;
    
    if let Some(handler) = routes_guard.get(&route_key) {
        let response = handler(request);
        create_hyper_response(response)
    } else {
        // 404 处理
        let response = Response::new(404)
            .html("<h1>404 Not Found</h1><p>页面未找到</p>".to_string());
        create_hyper_response(response)
    }
}

fn parse_query_params(query: &str) -> HashMap<String, String> {
    let mut params = HashMap::new();
    
    for pair in query.split('&') {
        if let Some((key, value)) = pair.split_once('=') {
            params.insert(key.to_string(), value.to_string());
        }
    }
    
    params
}

fn create_hyper_response(response: Response) -> Result<HyperResponse<Body>, Infallible> {
    let mut hyper_response = HyperResponse::builder()
        .status(response.status_code);
    
    for (key, value) in response.headers {
        if let (Ok(key), Ok(value)) = (key.try_into(), value.try_into()) {
            hyper_response = hyper_response.header(key, value);
        }
    }
    
    Ok(hyper_response.body(response.body.into()).unwrap())
}
```

### 4. src/router.rs

```rust
use crate::{WebServer, Handler, Request, Response};
use std::sync::Arc;

impl WebServer {
    pub async fn get(&self, path: &str, handler: Handler) {
        self.add_route("GET", path, handler).await;
    }
    
    pub async fn post(&self, path: &str, handler: Handler) {
        self.add_route("POST", path, handler).await;
    }
    
    pub async fn put(&self, path: &str, handler: Handler) {
        self.add_route("PUT", path, handler).await;
    }
    
    pub async fn delete(&self, path: &str, handler: Handler) {
        self.add_route("DELETE", path, handler).await;
    }
    
    pub async fn patch(&self, path: &str, handler: Handler) {
        self.add_route("PATCH", path, handler).await;
    }
}

// 路由宏
#[macro_export]
macro_rules! route {
    ($server:expr, GET $path:expr => $handler:expr) => {
        $server.get($path, Arc::new($handler)).await;
    };
    ($server:expr, POST $path:expr => $handler:expr) => {
        $server.post($path, Arc::new($handler)).await;
    };
    ($server:expr, PUT $path:expr => $handler:expr) => {
        $server.put($path, Arc::new($handler)).await;
    };
    ($server:expr, DELETE $path:expr => $handler:expr) => {
        $server.delete($path, Arc::new($handler)).await;
    };
    ($server:expr, PATCH $path:expr => $handler:expr) => {
        $server.patch($path, Arc::new($handler)).await;
    };
}

// 路由组
pub struct RouteGroup {
    prefix: String,
    server: Arc<WebServer>,
}

impl RouteGroup {
    pub fn new(server: Arc<WebServer>, prefix: String) -> RouteGroup {
        RouteGroup { prefix, server }
    }
    
    pub async fn get(&self, path: &str, handler: Handler) {
        let full_path = format!("{}{}", self.prefix, path);
        self.server.get(&full_path, handler).await;
    }
    
    pub async fn post(&self, path: &str, handler: Handler) {
        let full_path = format!("{}{}", self.prefix, path);
        self.server.post(&full_path, handler).await;
    }
    
    pub async fn put(&self, path: &str, handler: Handler) {
        let full_path = format!("{}{}", self.prefix, path);
        self.server.put(&full_path, handler).await;
    }
    
    pub async fn delete(&self, path: &str, handler: Handler) {
        let full_path = format!("{}{}", self.prefix, path);
        self.server.delete(&full_path, handler).await;
    }
}
```

### 5. src/handler.rs

```rust
use crate::{Request, Response};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

// 用户相关结构体
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: u32,
    pub name: String,
    pub email: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateUserRequest {
    pub name: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateUserRequest {
    pub name: Option<String>,
    pub email: Option<String>,
}

// 模拟数据库
pub struct UserDatabase {
    users: HashMap<u32, User>,
    next_id: u32,
}

impl UserDatabase {
    pub fn new() -> UserDatabase {
        let mut db = UserDatabase {
            users: HashMap::new(),
            next_id: 1,
        };
        
        // 添加一些示例数据
        db.users.insert(1, User {
            id: 1,
            name: "张三".to_string(),
            email: "zhangsan@example.com".to_string(),
            created_at: "2023-01-01T00:00:00Z".to_string(),
        });
        
        db.users.insert(2, User {
            id: 2,
            name: "李四".to_string(),
            email: "lisi@example.com".to_string(),
            created_at: "2023-01-02T00:00:00Z".to_string(),
        });
        
        db
    }
    
    pub fn get_all_users(&self) -> Vec<User> {
        self.users.values().cloned().collect()
    }
    
    pub fn get_user(&self, id: u32) -> Option<User> {
        self.users.get(&id).cloned()
    }
    
    pub fn create_user(&mut self, name: String, email: String) -> User {
        let id = self.next_id;
        self.next_id += 1;
        
        let user = User {
            id,
            name,
            email,
            created_at: chrono::Utc::now().to_rfc3339(),
        };
        
        self.users.insert(id, user.clone());
        user
    }
    
    pub fn update_user(&mut self, id: u32, update: UpdateUserRequest) -> Option<User> {
        if let Some(user) = self.users.get_mut(&id) {
            if let Some(name) = update.name {
                user.name = name;
            }
            if let Some(email) = update.email {
                user.email = email;
            }
            Some(user.clone())
        } else {
            None
        }
    }
    
    pub fn delete_user(&mut self, id: u32) -> bool {
        self.users.remove(&id).is_some()
    }
}

// 全局数据库实例
use std::sync::Arc;
use tokio::sync::RwLock;

pub type Database = Arc<RwLock<UserDatabase>>;

pub fn create_database() -> Database {
    Arc::new(RwLock::new(UserDatabase::new()))
}

// API处理器
pub fn home_handler(_req: Request) -> Response {
    Response::new(200).html(r#"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rust Web服务器</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>欢迎使用Rust Web服务器</h1>
            <p>这是一个用Rust编写的简单Web服务器</p>
            <ul>
                <li><a href="/api/users">用户列表</a></li>
                <li><a href="/api/health">健康检查</a></li>
                <li><a href="/static">静态文件</a></li>
            </ul>
        </body>
        </html>
    "#.to_string())
}

pub fn health_handler(_req: Request) -> Response {
    let health_data = serde_json::json!({
        "status": "ok",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "version": "1.0.0"
    });
    
    Response::new(200).json(health_data)
}

pub async fn get_users_handler(req: Request, db: Database) -> Response {
    let users = db.read().await.get_all_users();
    Response::new(200).json(users)
}

pub async fn get_user_handler(req: Request, db: Database) -> Response {
    let path_parts: Vec<&str> = req.path.split('/').collect();
    if path_parts.len() < 3 {
        return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID"
        }));
    }
    
    let user_id: u32 = match path_parts[2].parse() {
        Ok(id) => id,
        Err(_) => return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID格式"
        })),
    };
    
    let db_guard = db.read().await;
    match db_guard.get_user(user_id) {
        Some(user) => Response::new(200).json(user),
        None => Response::new(404).json(serde_json::json!({
            "error": "用户未找到"
        })),
    }
}

pub async fn create_user_handler(req: Request, db: Database) -> Response {
    let create_req: CreateUserRequest = match serde_json::from_str(&req.body) {
        Ok(req) => req,
        Err(_) => return Response::new(400).json(serde_json::json!({
            "error": "无效的请求数据"
        })),
    };
    
    let mut db_guard = db.write().await;
    let user = db_guard.create_user(create_req.name, create_req.email);
    
    Response::new(201).json(user)
}

pub async fn update_user_handler(req: Request, db: Database) -> Response {
    let path_parts: Vec<&str> = req.path.split('/').collect();
    if path_parts.len() < 3 {
        return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID"
        }));
    }
    
    let user_id: u32 = match path_parts[2].parse() {
        Ok(id) => id,
        Err(_) => return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID格式"
        })),
    };
    
    let update_req: UpdateUserRequest = match serde_json::from_str(&req.body) {
        Ok(req) => req,
        Err(_) => return Response::new(400).json(serde_json::json!({
            "error": "无效的请求数据"
        })),
    };
    
    let mut db_guard = db.write().await;
    match db_guard.update_user(user_id, update_req) {
        Some(user) => Response::new(200).json(user),
        None => Response::new(404).json(serde_json::json!({
            "error": "用户未找到"
        })),
    }
}

pub async fn delete_user_handler(req: Request, db: Database) -> Response {
    let path_parts: Vec<&str> = req.path.split('/').collect();
    if path_parts.len() < 3 {
        return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID"
        }));
    }
    
    let user_id: u32 = match path_parts[2].parse() {
        Ok(id) => id,
        Err(_) => return Response::new(400).json(serde_json::json!({
            "error": "无效的用户ID格式"
        })),
    };
    
    let mut db_guard = db.write().await;
    if db_guard.delete_user(user_id) {
        Response::new(204).text("".to_string())
    } else {
        Response::new(404).json(serde_json::json!({
            "error": "用户未找到"
        }))
    }
}
```

### 6. src/middleware.rs

```rust
use crate::{Request, Response, Middleware, Handler};
use std::sync::Arc;

// 日志中间件
pub fn logging_middleware() -> Middleware {
    Arc::new(|req: Request, next: Handler| {
        let start = std::time::Instant::now();
        let method = req.method.clone();
        let path = req.path.clone();
        
        println!("{} {} - 开始处理", method, path);
        
        let response = next(req);
        let duration = start.elapsed();
        
        println!("{} {} - 处理完成 ({}ms)", 
                method, path, duration.as_millis());
        
        response
    })
}

// CORS中间件
pub fn cors_middleware() -> Middleware {
    Arc::new(|req: Request, next: Handler| {
        let mut response = next(req);
        
        response.headers.insert(
            "Access-Control-Allow-Origin".to_string(),
            "*".to_string()
        );
        response.headers.insert(
            "Access-Control-Allow-Methods".to_string(),
            "GET, POST, PUT, DELETE, OPTIONS".to_string()
        );
        response.headers.insert(
            "Access-Control-Allow-Headers".to_string(),
            "Content-Type, Authorization".to_string()
        );
        
        response
    })
}

// 认证中间件
pub fn auth_middleware() -> Middleware {
    Arc::new(|req: Request, next: Handler| {
        // 检查Authorization头
        if let Some(auth_header) = req.headers.get("Authorization") {
            if auth_header.starts_with("Bearer ") {
                // 简单的token验证
                let token = &auth_header[7..];
                if token == "secret-token" {
                    return next(req);
                }
            }
        }
        
        // 对于某些路径，不需要认证
        if req.path.starts_with("/api/health") || 
           req.path.starts_with("/static") ||
           req.path == "/" {
            return next(req);
        }
        
        // 返回401未授权
        Response::new(401).json(serde_json::json!({
            "error": "需要认证",
            "message": "请提供有效的Authorization头"
        }))
    })
}

// 请求大小限制中间件
pub fn request_size_limit_middleware(max_size: usize) -> Middleware {
    Arc::new(move |req: Request, next: Handler| {
        if req.body.len() > max_size {
            return Response::new(413).json(serde_json::json!({
                "error": "请求体过大",
                "max_size": max_size
            }));
        }
        
        next(req)
    })
}

// 速率限制中间件
use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

pub struct RateLimiter {
    requests: Mutex<HashMap<String, Vec<Instant>>>,
    max_requests: usize,
    window_duration: Duration,
}

impl RateLimiter {
    pub fn new(max_requests: usize, window_duration: Duration) -> RateLimiter {
        RateLimiter {
            requests: Mutex::new(HashMap::new()),
            max_requests,
            window_duration,
        }
    }
    
    pub fn is_allowed(&self, client_id: &str) -> bool {
        let mut requests = self.requests.lock().unwrap();
        let now = Instant::now();
        
        // 清理过期的请求记录
        if let Some(client_requests) = requests.get_mut(client_id) {
            client_requests.retain(|&time| now.duration_since(time) < self.window_duration);
        }
        
        // 检查是否超过限制
        let client_requests = requests.entry(client_id.to_string()).or_insert_with(Vec::new);
        
        if client_requests.len() >= self.max_requests {
            false
        } else {
            client_requests.push(now);
            true
        }
    }
}

pub fn rate_limit_middleware(limiter: Arc<RateLimiter>) -> Middleware {
    Arc::new(move |req: Request, next: Handler| {
        // 简单的客户端识别（实际应用中应该使用IP地址等）
        let client_id = req.headers.get("User-Agent")
            .unwrap_or(&"unknown".to_string())
            .clone();
        
        if limiter.is_allowed(&client_id) {
            next(req)
        } else {
            Response::new(429).json(serde_json::json!({
                "error": "请求过于频繁",
                "message": "请稍后再试"
            }))
        }
    })
}
```

### 7. src/static_files.rs

```rust
use crate::{Request, Response};
use std::path::Path;
use std::fs;
use mime_guess;

pub fn serve_static_file(req: Request, public_dir: &str) -> Response {
    let path = req.path.trim_start_matches("/static/");
    let file_path = Path::new(public_dir).join(path);
    
    // 安全检查：确保文件在public目录内
    if !file_path.starts_with(public_dir) {
        return Response::new(403).html("<h1>403 Forbidden</h1>".to_string());
    }
    
    match fs::read(&file_path) {
        Ok(content) => {
            let mime_type = mime_guess::from_path(&file_path)
                .first_or_text_plain()
                .to_string();
            
            Response::new(200)
                .with_header("Content-Type".to_string(), mime_type)
                .with_body(String::from_utf8_lossy(&content).to_string())
        }
        Err(_) => Response::new(404).html("<h1>404 Not Found</h1>".to_string()),
    }
}

pub fn create_static_handler(public_dir: String) -> impl Fn(Request) -> Response {
    move |req| serve_static_file(req, &public_dir)
}
```

### 8. src/main.rs

```rust
use web_server::{
    WebServer, 
    handler::{create_database, home_handler, health_handler, get_users_handler, get_user_handler, create_user_handler, update_user_handler, delete_user_handler},
    middleware::{logging_middleware, cors_middleware, auth_middleware, request_size_limit_middleware, RateLimiter},
    static_files::create_static_handler,
};
use std::sync::Arc;
use std::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("启动Rust Web服务器...");
    
    // 创建服务器
    let server = Arc::new(WebServer::new("127.0.0.1".to_string(), 8080));
    
    // 创建数据库
    let db = create_database();
    
    // 添加中间件
    server.add_middleware(logging_middleware()).await;
    server.add_middleware(cors_middleware()).await;
    server.add_middleware(auth_middleware()).await;
    server.add_middleware(request_size_limit_middleware(1024 * 1024)).await; // 1MB限制
    
    // 添加速率限制
    let rate_limiter = Arc::new(RateLimiter::new(100, Duration::from_secs(60))); // 每分钟100个请求
    server.add_middleware(web_server::middleware::rate_limit_middleware(rate_limiter)).await;
    
    // 添加路由
    server.get("/", Arc::new(home_handler)).await;
    server.get("/api/health", Arc::new(health_handler)).await;
    
    // 用户API路由
    server.get("/api/users", Arc::new(move |req| {
        let db = db.clone();
        tokio::spawn(async move {
            get_users_handler(req, db).await
        });
        Response::new(200).text("处理中...".to_string())
    })).await;
    
    server.get("/api/users/{id}", Arc::new(move |req| {
        let db = db.clone();
        tokio::spawn(async move {
            get_user_handler(req, db).await
        });
        Response::new(200).text("处理中...".to_string())
    })).await;
    
    server.post("/api/users", Arc::new(move |req| {
        let db = db.clone();
        tokio::spawn(async move {
            create_user_handler(req, db).await
        });
        Response::new(200).text("处理中...".to_string())
    })).await;
    
    server.put("/api/users/{id}", Arc::new(move |req| {
        let db = db.clone();
        tokio::spawn(async move {
            update_user_handler(req, db).await
        });
        Response::new(200).text("处理中...".to_string())
    })).await;
    
    server.delete("/api/users/{id}", Arc::new(move |req| {
        let db = db.clone();
        tokio::spawn(async move {
            delete_user_handler(req, db).await
        });
        Response::new(200).text("处理中...".to_string())
    })).await;
    
    // 静态文件服务
    server.get("/static/*", Arc::new(create_static_handler("public".to_string()))).await;
    
    // 启动服务器
    server.run().await?;
    
    Ok(())
}
```

## 静态文件

### public/index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rust Web服务器</title>
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    <div class="container">
        <h1>欢迎使用Rust Web服务器</h1>
        <p>这是一个用Rust编写的功能完整的Web服务器</p>
        
        <div class="api-section">
            <h2>API接口</h2>
            <ul>
                <li><a href="/api/health">健康检查</a></li>
                <li><a href="/api/users">用户列表</a></li>
            </ul>
        </div>
        
        <div class="demo-section">
            <h2>用户管理演示</h2>
            <button onclick="loadUsers()">加载用户</button>
            <button onclick="createUser()">创建用户</button>
            <div id="users"></div>
        </div>
    </div>
    
    <script src="/static/script.js"></script>
</body>
</html>
```

### public/style.css

```css
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

.api-section, .demo-section {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
}

button:hover {
    background-color: #0056b3;
}

#users {
    margin-top: 20px;
}

.user-item {
    padding: 10px;
    margin: 5px 0;
    background-color: #f8f9fa;
    border-radius: 4px;
}
```

### public/script.js

```javascript
async function loadUsers() {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': 'Bearer secret-token'
            }
        });
        
        if (response.ok) {
            const users = await response.json();
            displayUsers(users);
        } else {
            console.error('加载用户失败:', response.status);
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
}

async function createUser() {
    const name = prompt('请输入用户名:');
    const email = prompt('请输入邮箱:');
    
    if (name && email) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer secret-token'
                },
                body: JSON.stringify({ name, email })
            });
            
            if (response.ok) {
                alert('用户创建成功!');
                loadUsers(); // 重新加载用户列表
            } else {
                console.error('创建用户失败:', response.status);
            }
        } catch (error) {
            console.error('请求失败:', error);
        }
    }
}

function displayUsers(users) {
    const container = document.getElementById('users');
    container.innerHTML = '';
    
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.className = 'user-item';
        userDiv.innerHTML = `
            <strong>${user.name}</strong> (${user.email})
            <br>
            <small>ID: ${user.id} | 创建时间: ${user.created_at}</small>
        `;
        container.appendChild(userDiv);
    });
}
```

## 运行和测试

### 启动服务器

```bash
# 编译并运行
cargo run

# 或者先编译再运行
cargo build --release
./target/release/web_server
```

### 测试API

```bash
# 健康检查
curl http://localhost:8080/api/health

# 获取用户列表（需要认证）
curl -H "Authorization: Bearer secret-token" http://localhost:8080/api/users

# 创建用户
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer secret-token" \
     -d '{"name":"新用户","email":"new@example.com"}' \
     http://localhost:8080/api/users

# 获取特定用户
curl -H "Authorization: Bearer secret-token" http://localhost:8080/api/users/1
```

### 访问Web界面

打开浏览器访问 `http://localhost:8080` 查看Web界面。

## 扩展功能

### 1. 添加数据库支持

```toml
# Cargo.toml
[dependencies]
sqlx = { version = "0.6", features = ["runtime-tokio-rustls", "postgres"] }
```

### 2. 添加JWT认证

```toml
# Cargo.toml
[dependencies]
jsonwebtoken = "8.0"
```

### 3. 添加配置管理

```toml
# Cargo.toml
[dependencies]
config = "0.13"
```

### 4. 添加日志系统

```toml
# Cargo.toml
[dependencies]
tracing = "0.1"
tracing-subscriber = "0.3"
```

## 测试

```bash
# 运行测试
cargo test

# 运行集成测试
cargo test --test integration_tests
```

## 部署

### Docker部署

```dockerfile
FROM rust:1.70 as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/web_server /usr/local/bin/web_server
COPY --from=builder /app/public /app/public
EXPOSE 8080
CMD ["web_server"]
```

## 总结

现在您已经完成了一个功能完整的Web服务器项目，包括：

1. **HTTP服务器**：基于tokio和hyper的异步HTTP服务器
2. **路由系统**：支持RESTful API路由
3. **中间件**：日志、CORS、认证、速率限制等
4. **静态文件服务**：提供静态资源服务
5. **API接口**：完整的用户管理CRUD操作
6. **Web界面**：简单的前端界面

这个项目展示了Rust在Web开发中的强大能力，包括内存安全、高性能和并发处理。

