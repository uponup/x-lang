<template><div><h1 id="rust-语言入门教程" tabindex="-1"><a class="header-anchor" href="#rust-语言入门教程"><span>Rust 语言入门教程</span></a></h1>
<h2 id="教程概述" tabindex="-1"><a class="header-anchor" href="#教程概述"><span>教程概述</span></a></h2>
<p>这是一个专为初学者设计的Rust语言教程，旨在帮助您在一天内掌握Rust的核心概念并通过实践项目熟练掌握Rust API。</p>
<h2 id="学习路径" tabindex="-1"><a class="header-anchor" href="#学习路径"><span>学习路径</span></a></h2>
<h3 id="一-基础概念-2-3小时" tabindex="-1"><a class="header-anchor" href="#一-基础概念-2-3小时"><span>一：基础概念 (2-3小时)</span></a></h3>
<ol>
<li><RouteLink to="/rust_p/01_basics/01_environment.html">环境搭建和Hello World</RouteLink></li>
<li><RouteLink to="/rust_p/01_basics/02_variables_types.html">变量和数据类型</RouteLink></li>
<li><RouteLink to="/rust_p/01_basics/03_control_flow.html">控制流</RouteLink></li>
<li><RouteLink to="/rust_p/01_basics/04_functions.html">函数</RouteLink></li>
</ol>
<h3 id="二-核心特性-3-4小时" tabindex="-1"><a class="header-anchor" href="#二-核心特性-3-4小时"><span>二：核心特性 (3-4小时)</span></a></h3>
<ol start="5">
<li><RouteLink to="/rust_p/02_ownership/01_ownership.html">所有权系统</RouteLink></li>
<li><RouteLink to="/rust_p/02_ownership/02_borrowing.html">借用和引用</RouteLink></li>
<li><RouteLink to="/rust_p/03_data_structures/01_structs_enums.html">结构体和枚举</RouteLink></li>
<li><RouteLink to="/rust_p/03_data_structures/02_collections.html">集合类型</RouteLink></li>
</ol>
<h3 id="三-高级特性-2-3小时" tabindex="-1"><a class="header-anchor" href="#三-高级特性-2-3小时"><span>三：高级特性 (2-3小时)</span></a></h3>
<ol start="9">
<li><RouteLink to="/rust_p/04_advanced/01_error_handling.html">错误处理</RouteLink></li>
<li><RouteLink to="/rust_p/04_advanced/02_modules_packages.html">模块和包管理</RouteLink></li>
<li><RouteLink to="/rust_p/04_advanced/03_std_library_guide.html">标准库学习指南</RouteLink></li>
<li><RouteLink to="/rust_p/04_advanced/04_generics_traits.html">泛型和trait</RouteLink></li>
</ol>
<h3 id="四-实践项目-2-3小时" tabindex="-1"><a class="header-anchor" href="#四-实践项目-2-3小时"><span>四：实践项目 (2-3小时)</span></a></h3>
<ol start="13">
<li><RouteLink to="/rust_p/05_projects/01_calculator.html">命令行计算器</RouteLink></li>
<li><RouteLink to="/rust_p/05_projects/02_file_processor.html">文件处理工具</RouteLink></li>
<li><RouteLink to="/rust_p/05_projects/03_web_server.html">简单Web服务器</RouteLink></li>
</ol>
<h2 id="快速开始" tabindex="-1"><a class="header-anchor" href="#快速开始"><span>快速开始</span></a></h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 安装Rust</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">--proto</span> <span class="token string">'=https'</span> <span class="token parameter variable">--tlsv1.2</span> <span class="token parameter variable">-sSf</span> https://sh.rustup.rs <span class="token operator">|</span> <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证安装</span></span>
<span class="line">rustc <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token function">cargo</span> <span class="token parameter variable">--version</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 运行第一个程序</span></span>
<span class="line"><span class="token function">cargo</span> new hello_world</span>
<span class="line"><span class="token builtin class-name">cd</span> hello_world</span>
<span class="line"><span class="token function">cargo</span> run</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="学习建议" tabindex="-1"><a class="header-anchor" href="#学习建议"><span>学习建议</span></a></h2>
<ol>
<li><strong>按顺序学习</strong>：每个章节都建立在前一章的基础上</li>
<li><strong>动手实践</strong>：每个概念都配有相应的代码示例</li>
<li><strong>完成练习</strong>：每章末尾都有练习题，务必完成</li>
<li><strong>运行代码</strong>：不要只看代码，一定要运行并修改</li>
<li><strong>查阅文档</strong>：遇到问题时查阅官方文档</li>
</ol>
<h2 id="资源链接" tabindex="-1"><a class="header-anchor" href="#资源链接"><span>资源链接</span></a></h2>
<ul>
<li><a href="https://doc.rust-lang.org/book/" target="_blank" rel="noopener noreferrer">Rust官方文档</a></li>
<li><a href="https://doc.rust-lang.org/rust-by-example/" target="_blank" rel="noopener noreferrer">Rust by Example</a></li>
<li><a href="https://doc.rust-lang.org/cargo/" target="_blank" rel="noopener noreferrer">Cargo文档</a></li>
<li><a href="https://doc.rust-lang.org/std/" target="_blank" rel="noopener noreferrer">标准库文档</a></li>
</ul>
<p>开始您的Rust学习之旅吧！🚀</p>
</div></template>


