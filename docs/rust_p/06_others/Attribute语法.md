让我为你详细介绍 Rust 的 **Attribute（属性）** 语法。

[2 tools called]

# Rust Attribute（属性）语法完整指南

## **一、什么是 Attribute？**

Attribute 是 Rust 的元数据注解，用于：
- 控制编译器行为
- 自动生成代码
- 配置条件编译
- 添加文档
- 标记测试函数

## **二、基本语法**

```rust
// 1. 外部属性 - 作用于下一个项目
#[attribute]
struct MyStruct;

// 2. 内部属性 - 作用于包含它的项目
#![attribute]

// 3. 带参数的属性
#[attribute(param)]
#[attribute(key = "value")]
#[attribute(param1, param2)]

// 4. 多行属性
#[attribute1]
#[attribute2]
struct MyStruct;
```

## **三、常见的内置 Attribute**

### **1. `#[derive(...)]` - 自动实现 trait**

```rust
// 从你的项目中：
#[derive(Debug, Clone, Serialize, Deserialize, Record, Default)]
pub struct DexSummaryDetail {
    pub summary: Option<String>,
}
```

常见的派生 trait：
- `Debug` - 调试打印（`{:?}`）
- `Clone` - 克隆能力
- `Copy` - 按位复制
- `PartialEq` / `Eq` - 相等比较
- `PartialOrd` / `Ord` - 排序比较
- `Default` - 默认值
- `Hash` - 哈希能力

### **2. `#[cfg(...)]` - 条件编译**

```rust
// 仅在测试时编译
#[cfg(test)]
mod tests {}

// 仅在 Unix 系统编译
#[cfg(target_os = "unix")]
fn unix_only() {}

// 仅在 debug 模式
#[cfg(debug_assertions)]
fn debug_only() {}

// 仅在 Android 平台
#[cfg(target_os = "android")]
use jni;
```

### **3. `#[test]` - 测试函数**

```rust
#[test]
fn test_something() {
    assert_eq!(2 + 2, 4);
}

#[test]
#[ignore]  // 默认跳过此测试
fn expensive_test() {}
```

### **4. `#[allow(...)]` / `#[warn(...)]` / `#[deny(...)]` - 控制 lint**

```rust
// 允许未使用的变量
#[allow(unused_variables)]
fn foo() {
    let x = 5;
}

// 警告废弃的代码
#[warn(deprecated)]
fn bar() {}

// 禁止不安全代码
#[deny(unsafe_code)]
mod safe_module {}
```

### **5. `#[deprecated]` - 标记废弃**

```rust
#[deprecated(since = "1.0.0", note = "请使用 new_function 代替")]
fn old_function() {}
```

### **6. `#[inline]` - 内联提示**

```rust
// 建议内联
#[inline]
fn small_function() {}

// 始终内联
#[inline(always)]
fn must_inline() {}

// 从不内联
#[inline(never)]
fn never_inline() {}
```

## **四、第三方库的 Attribute**

### **1. Serde - 序列化/反序列化**

```rust
// 从你的项目中：
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]  // 容器级属性
pub struct DexSummaryData {
    #[serde(default, deserialize_with = "de_opt_string_from_int_or_str")]  // 字段级属性
    pub beta: Option<String>,
}
```

常用 serde 属性：
```rust
#[serde(rename = "newName")]           // 重命名字段
#[serde(rename_all = "camelCase")]     // 批量重命名
#[serde(skip)]                         // 跳过序列化
#[serde(skip_serializing_if = "...")]  // 条件跳过
#[serde(default)]                      // 使用默认值
#[serde(flatten)]                      // 展平嵌套结构
```

### **2. Thiserror - 错误处理**

```rust
// 从你的项目中：
#[derive(Debug, thiserror::Error)]
pub enum GatewayError {
    #[error("network: {0}")]
    Network(String),
    
    #[error("parse: {0}")]
    Parse(String),
    
    #[error("request factory not registered")]
    NoFactory,
}
```

### **3. UniFFI - 跨语言绑定**

```rust
#[derive(uniffi::Record)]  // 生成 FFI 绑定
pub struct DexSummaryDetail {
    pub summary: Option<String>,
}

#[derive(uniffi::Error)]
pub enum MyError {
    NetworkError,
}
```

### **4. Tokio - 异步运行时**

```rust
// 异步测试
#[tokio::test]
async fn async_test() {
    // 异步代码
}

// 异步主函数
#[tokio::main]
async fn main() {
    // 异步代码
}
```

## **五、完整示例（从你的项目）**

```rust
use serde::{Deserialize, Serialize};
use uniffi::Record;

// 多个 derive 宏
#[derive(Debug, Clone, Serialize, Deserialize, Record, Default)]
// serde 配置
#[serde(rename_all = "camelCase", default)]
// 自定义可见性
pub(in crate::biz_service::dex) struct DexSummaryDetail {
    pub(in crate::biz_service::dex) summary: Option<String>,
    pub(in crate::biz_service::dex) translated_summary: Option<String>,
    pub(in crate::biz_service::dex) updated_time: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Record, Default)]
#[serde(rename_all = "camelCase", default)]
pub(in crate::biz_service::dex) struct DexSummaryData {
    // 字段级 serde 配置
    #[serde(default, deserialize_with = "de_opt_string_from_int_or_str")]
    pub(in crate::biz_service::dex) beta: Option<String>,
    
    pub(in crate::biz_service::dex) mention_detail: Option<String>,
    pub(in crate::biz_service::dex) summary_detail: Option<DexSummaryDetail>,
}
```