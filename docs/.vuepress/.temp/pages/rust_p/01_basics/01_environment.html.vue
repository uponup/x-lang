<template><div><h1 id="环境搭建和hello-world" tabindex="-1"><a class="header-anchor" href="#环境搭建和hello-world"><span>环境搭建和Hello World</span></a></h1>
<h2 id="安装rust" tabindex="-1"><a class="header-anchor" href="#安装rust"><span>安装Rust</span></a></h2>
<h3 id="_1-安装rust工具链" tabindex="-1"><a class="header-anchor" href="#_1-安装rust工具链"><span>1. 安装Rust工具链</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 下载并安装rustup</span></span>
<span class="line"><span class="token function">curl</span> <span class="token parameter variable">--proto</span> <span class="token string">'=https'</span> <span class="token parameter variable">--tlsv1.2</span> <span class="token parameter variable">-sSf</span> https://sh.rustup.rs <span class="token operator">|</span> <span class="token function">sh</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 重新加载shell配置</span></span>
<span class="line"><span class="token builtin class-name">source</span> ~/.cargo/env</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 验证安装</span></span>
<span class="line">rustc <span class="token parameter variable">--version</span></span>
<span class="line"><span class="token function">cargo</span> <span class="token parameter variable">--version</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-配置开发环境" tabindex="-1"><a class="header-anchor" href="#_2-配置开发环境"><span>2. 配置开发环境</span></a></h3>
<p>推荐使用VS Code + Rust扩展，或者CLion等IDE。</p>
<h2 id="第一个rust程序" tabindex="-1"><a class="header-anchor" href="#第一个rust程序"><span>第一个Rust程序</span></a></h2>
<h3 id="使用cargo创建项目" tabindex="-1"><a class="header-anchor" href="#使用cargo创建项目"><span>使用Cargo创建项目</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 创建新项目</span></span>
<span class="line"><span class="token function">cargo</span> new hello_world</span>
<span class="line"><span class="token builtin class-name">cd</span> hello_world</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看项目结构</span></span>
<span class="line">tree</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>项目结构：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">hello_world/</span>
<span class="line">├── Cargo.toml    # 项目配置文件</span>
<span class="line">└── src/</span>
<span class="line">    └── main.rs   # 主程序文件</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="hello-world程序" tabindex="-1"><a class="header-anchor" href="#hello-world程序"><span>Hello World程序</span></a></h3>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs"><pre v-pre><code><span class="line"><span class="token comment">// src/main.rs</span></span>
<span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"Hello, world!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="运行程序" tabindex="-1"><a class="header-anchor" href="#运行程序"><span>运行程序</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 编译并运行</span></span>
<span class="line"><span class="token function">cargo</span> run</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或者分步执行</span></span>
<span class="line"><span class="token function">cargo</span> build</span>
<span class="line">./target/debug/hello_world</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="cargo-toml-配置文件" tabindex="-1"><a class="header-anchor" href="#cargo-toml-配置文件"><span>Cargo.toml 配置文件</span></a></h2>
<div class="language-toml line-numbers-mode" data-highlighter="prismjs" data-ext="toml"><pre v-pre><code><span class="line"><span class="token punctuation">[</span><span class="token table class-name">package</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token key property">name</span> <span class="token punctuation">=</span> <span class="token string">"hello_world"</span></span>
<span class="line"><span class="token key property">version</span> <span class="token punctuation">=</span> <span class="token string">"0.1.0"</span></span>
<span class="line"><span class="token key property">edition</span> <span class="token punctuation">=</span> <span class="token string">"2021"</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">[</span><span class="token table class-name">dependencies</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># 在这里添加依赖</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="练习1-修改hello-world" tabindex="-1"><a class="header-anchor" href="#练习1-修改hello-world"><span>练习1：修改Hello World</span></a></h2>
<ol>
<li>修改程序输出您的姓名</li>
<li>添加多行输出</li>
<li>使用不同的println!宏</li>
</ol>
<h3 id="答案" tabindex="-1"><a class="header-anchor" href="#答案"><span>答案</span></a></h3>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs"><pre v-pre><code><span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"Hello, 我是Rust学习者!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"今天开始学习Rust语言"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"Rust是一门系统编程语言"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 使用不同的格式化</span></span>
<span class="line">    <span class="token keyword">let</span> name <span class="token operator">=</span> <span class="token string">"张三"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">let</span> age <span class="token operator">=</span> <span class="token number">25</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"我叫{}，今年{}岁"</span><span class="token punctuation">,</span> name<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="练习2-创建多个函数" tabindex="-1"><a class="header-anchor" href="#练习2-创建多个函数"><span>练习2：创建多个函数</span></a></h2>
<div class="language-rust line-numbers-mode" data-highlighter="prismjs" data-ext="rs"><pre v-pre><code><span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">calculate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">show_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">greet</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"欢迎来到Rust世界!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">calculate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">let</span> a <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">let</span> b <span class="token operator">=</span> <span class="token number">20</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">let</span> sum <span class="token operator">=</span> a <span class="token operator">+</span> b<span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"{} + {} = {}"</span><span class="token punctuation">,</span> a<span class="token punctuation">,</span> b<span class="token punctuation">,</span> sum<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">fn</span> <span class="token function-definition function">show_info</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"Rust特点："</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"- 内存安全"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"- 零成本抽象"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token macro property">println!</span><span class="token punctuation">(</span><span class="token string">"- 并发安全"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="下一步" tabindex="-1"><a class="header-anchor" href="#下一步"><span>下一步</span></a></h2>
<p>现在您已经成功搭建了Rust开发环境并运行了第一个程序。接下来我们将学习Rust的变量和数据类型。</p>
</div></template>


