export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":"Home"} }],
  ["/rust_p/", { loader: () => import(/* webpackChunkName: "rust_p_index.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/index.html.js"), meta: {"title":"Rust 语言入门教程"} }],
  ["/rust_p/01_basics/01_environment.html", { loader: () => import(/* webpackChunkName: "rust_p_01_basics_01_environment.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/01_basics/01_environment.html.js"), meta: {"title":"环境搭建和Hello World"} }],
  ["/rust_p/01_basics/02_variables_types.html", { loader: () => import(/* webpackChunkName: "rust_p_01_basics_02_variables_types.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/01_basics/02_variables_types.html.js"), meta: {"title":"变量和数据类型"} }],
  ["/rust_p/01_basics/03_control_flow.html", { loader: () => import(/* webpackChunkName: "rust_p_01_basics_03_control_flow.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/01_basics/03_control_flow.html.js"), meta: {"title":"控制流"} }],
  ["/rust_p/01_basics/04_functions.html", { loader: () => import(/* webpackChunkName: "rust_p_01_basics_04_functions.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/01_basics/04_functions.html.js"), meta: {"title":"函数"} }],
  ["/rust_p/03_data_structures/01_structs_enums.html", { loader: () => import(/* webpackChunkName: "rust_p_03_data_structures_01_structs_enums.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/03_data_structures/01_structs_enums.html.js"), meta: {"title":"结构体和枚举"} }],
  ["/rust_p/03_data_structures/02_collections.html", { loader: () => import(/* webpackChunkName: "rust_p_03_data_structures_02_collections.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/03_data_structures/02_collections.html.js"), meta: {"title":"集合类型"} }],
  ["/rust_p/02_ownership/01_ownership.html", { loader: () => import(/* webpackChunkName: "rust_p_02_ownership_01_ownership.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/02_ownership/01_ownership.html.js"), meta: {"title":"所有权系统"} }],
  ["/rust_p/02_ownership/02_borrowing.html", { loader: () => import(/* webpackChunkName: "rust_p_02_ownership_02_borrowing.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/02_ownership/02_borrowing.html.js"), meta: {"title":"借用和引用"} }],
  ["/rust_p/04_advanced/01_error_handling.html", { loader: () => import(/* webpackChunkName: "rust_p_04_advanced_01_error_handling.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/04_advanced/01_error_handling.html.js"), meta: {"title":"错误处理"} }],
  ["/rust_p/04_advanced/02_modules_packages.html", { loader: () => import(/* webpackChunkName: "rust_p_04_advanced_02_modules_packages.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/04_advanced/02_modules_packages.html.js"), meta: {"title":"模块和包管理"} }],
  ["/rust_p/04_advanced/03_std_library_guide.html", { loader: () => import(/* webpackChunkName: "rust_p_04_advanced_03_std_library_guide.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/04_advanced/03_std_library_guide.html.js"), meta: {"title":"Rust标准库学习指南"} }],
  ["/rust_p/05_projects/01_calculator.html", { loader: () => import(/* webpackChunkName: "rust_p_05_projects_01_calculator.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/05_projects/01_calculator.html.js"), meta: {"title":"实践项目1：命令行计算器"} }],
  ["/rust_p/05_projects/02_file_processor.html", { loader: () => import(/* webpackChunkName: "rust_p_05_projects_02_file_processor.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/05_projects/02_file_processor.html.js"), meta: {"title":"实践项目2：文件处理工具"} }],
  ["/rust_p/05_projects/03_web_server.html", { loader: () => import(/* webpackChunkName: "rust_p_05_projects_03_web_server.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/05_projects/03_web_server.html.js"), meta: {"title":"实践项目3：简单Web服务器"} }],
  ["/rust_p/06_others/Attribute%E8%AF%AD%E6%B3%95.html", { loader: () => import(/* webpackChunkName: "rust_p_06_others_Attribute语法.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/06_others/Attribute语法.html.js"), meta: {"title":"Rust Attribute（属性）语法完整指南"} }],
  ["/rust_p/06_others/mod_rs%E5%92%8Clib_rs%E7%9A%84%E5%8C%BA%E5%88%AB.html", { loader: () => import(/* webpackChunkName: "rust_p_06_others_mod_rs和lib_rs的区别.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/06_others/mod_rs和lib_rs的区别.html.js"), meta: {"title":""} }],
  ["/rust_p/06_others/%E5%8F%AF%E8%A7%81%E6%80%A7%E4%BF%AE%E9%A5%B0%E7%AC%A6%E5%AF%B9%E6%AF%94.html", { loader: () => import(/* webpackChunkName: "rust_p_06_others_可见性修饰符对比.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/06_others/可见性修饰符对比.html.js"), meta: {"title":""} }],
  ["/rust_p/exercises/", { loader: () => import(/* webpackChunkName: "rust_p_exercises_index.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/exercises/index.html.js"), meta: {"title":"Rust 练习题集"} }],
  ["/rust_p/exercises/basic_exercises.html", { loader: () => import(/* webpackChunkName: "rust_p_exercises_basic_exercises.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/rust_p/exercises/basic_exercises.html.js"), meta: {"title":"基础练习 (1-20)"} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"/Users/oker/upon/x-lang/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
