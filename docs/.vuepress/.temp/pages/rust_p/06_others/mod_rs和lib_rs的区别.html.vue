<template><div><p>在 Rust 中，<code v-pre>mod.rs</code> 和 <code v-pre>lib.rs</code> 有以下区别：</p>
<h2 id="lib-rs" tabindex="-1"><a class="header-anchor" href="#lib-rs"><span><strong>lib.rs</strong></span></a></h2>
<ul>
<li><strong>库的根文件</strong>（crate root）</li>
<li>定义一个库 crate 的入口点</li>
<li>在 <code v-pre>Cargo.toml</code> 中通过 <code v-pre>[lib]</code> 配置指定</li>
<li>一个项目通常只有一个 <code v-pre>lib.rs</code></li>
<li>用于导出整个库的公共 API</li>
</ul>
<h2 id="mod-rs" tabindex="-1"><a class="header-anchor" href="#mod-rs"><span><strong>mod.rs</strong></span></a></h2>
<ul>
<li><strong>模块目录的入口文件</strong></li>
<li>用于将一个目录组织成一个模块</li>
<li>可以有多个 <code v-pre>mod.rs</code> 文件（在不同的子目录中）</li>
<li>从 Rust 2018 版本开始，可以用与目录同名的 <code v-pre>.rs</code> 文件替代</li>
</ul>
<h2 id="在你的项目中的例子" tabindex="-1"><a class="header-anchor" href="#在你的项目中的例子"><span><strong>在你的项目中的例子：</strong></span></a></h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">components/lib.rs                          # 整个 components 库的根入口</span>
<span class="line">components/biz-service/mod.rs              # biz-service 模块的入口</span>
<span class="line">components/foundation/mod.rs               # foundation 模块的入口</span>
<span class="line">components/platform-service/mod.rs         # platform-service 模块的入口</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="使用示例" tabindex="-1"><a class="header-anchor" href="#使用示例"><span><strong>使用示例：</strong></span></a></h2>
<p><strong>传统方式（使用 mod.rs）：</strong></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">my_module/</span>
<span class="line">  ├── mod.rs        # 模块入口</span>
<span class="line">  ├── submodule1.rs</span>
<span class="line">  └── submodule2.rs</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>现代方式（Rust 2018+）：</strong></p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">my_module.rs        # 直接用文件名作为模块</span>
<span class="line">my_module/</span>
<span class="line">  ├── submodule1.rs</span>
<span class="line">  └── submodule2.rs</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在你当前查看的 <code v-pre>components/biz-service/dex/src/request/ai_summary/mod.rs</code> 中，这个 <code v-pre>mod.rs</code> 文件就是 <code v-pre>ai_summary</code> 模块的入口文件，用于组织和导出该模块的内容。</p>
</div></template>


