# Rust 语言入门教程

## 教程概述

这是一个专为初学者设计的Rust语言教程，旨在帮助您在一天内掌握Rust的核心概念并通过实践项目熟练掌握Rust API。

## 学习路径

### 一：基础概念 (2-3小时)
1. [环境搭建和Hello World](./01_basics/01_environment.md)
2. [变量和数据类型](./01_basics/02_variables_types.md)
3. [控制流](./01_basics/03_control_flow.md)
4. [函数](./01_basics/04_functions.md)

### 二：核心特性 (3-4小时)
5. [所有权系统](./02_ownership/01_ownership.md)
6. [借用和引用](./02_ownership/02_borrowing.md)
7. [结构体和枚举](./03_data_structures/01_structs_enums.md)
8. [集合类型](./03_data_structures/02_collections.md)

### 三：高级特性 (2-3小时)
9. [错误处理](./04_advanced/01_error_handling.md)
10. [模块和包管理](./04_advanced/02_modules_packages.md)
11. [标准库学习指南](./04_advanced/03_std_library_guide.md)
12. [泛型和trait](./04_advanced/04_generics_traits.md)

### 四：实践项目 (2-3小时)
13. [命令行计算器](./05_projects/01_calculator.md)
14. [文件处理工具](./05_projects/02_file_processor.md)
15. [简单Web服务器](./05_projects/03_web_server.md)

### 五：进阶主题
16. [练习题集](./exercises/README.md)

### 六：其他参考资料

> 宏系统
17. [过程宏详解](./06_others/01_1过程宏.md)
18. [派生宏详解](./06_others/01_2派生宏.md)
19. [声明宏详解](./06_others/02_声明宏.md)

> 其他语法
20. [Attribute语法](./06_others/Attribute语法.md)
21. [模块系统详解（mod.rs vs Python）](./06_others/模块系统详解.md)
22. [mod.rs和lib.rs的区别](./06_others/mod_rs和lib_rs的区别.md)
23. [可见性修饰符对比](./06_others/可见性修饰符对比.md)
24. [OnceLock 和 OnceCell](./06_others/OnceLock和OnceCell.md)

### 七：UniFFI - 跨语言调用
25. [UniFFI 导出详解](./07_Uniffi/uniffi::export.md)

### 八：Tokio 异步编程
26. [Tokio 入门](./08_async/01_tokio_intro.md)
27. [异步编程基础](./08_async/02_async_basics.md)
28. [Tokio Runtime](./08_async/03_tokio_runtime.md)
29. [Tokio vs 其他运行时](./08_async/04_tokio_vs_others.md)
30. [实战项目](./08_async/05_projects.md)

## 快速开始

```bash
# 安装Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 验证安装
rustc --version
cargo --version

# 运行第一个程序
cargo new hello_world
cd hello_world
cargo run
```

## 学习建议

1. **按顺序学习**：每个章节都建立在前一章的基础上
2. **动手实践**：每个概念都配有相应的代码示例
3. **完成练习**：每章末尾都有练习题，务必完成
4. **运行代码**：不要只看代码，一定要运行并修改
5. **查阅文档**：遇到问题时查阅官方文档


## 资源链接

- [Rust官方文档](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Cargo文档](https://doc.rust-lang.org/cargo/)
- [标准库文档](https://doc.rust-lang.org/std/)

开始您的Rust学习之旅吧！🚀