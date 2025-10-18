# 集合类型

## Vector（动态数组）

### 创建和使用Vec

```rust
fn main() {
    // 创建空向量
    let mut v: Vec<i32> = Vec::new();
    
    // 使用宏创建向量
    let mut v2 = vec![1, 2, 3, 4, 5];
    
    // 添加元素
    v.push(1);
    v.push(2);
    v.push(3);
    
    // 访问元素
    let third: &i32 = &v[2];
    println!("第三个元素: {}", third);
    
    // 安全访问
    match v.get(2) {
        Some(third) => println!("第三个元素: {}", third),
        None => println!("没有第三个元素"),
    }
    
    // 遍历向量
    for i in &v {
        println!("{}", i);
    }
    
    // 可变遍历
    for i in &mut v {
        *i += 50;
    }
    
    println!("修改后的向量: {:?}", v);
}
```

### Vec的常用方法

```rust
fn main() {
    let mut numbers = vec![1, 2, 3, 4, 5];
    
    // 长度和容量
    println!("长度: {}", numbers.len());
    println!("容量: {}", numbers.capacity());
    
    // 添加元素
    numbers.push(6);
    numbers.insert(0, 0);  // 在索引0插入0
    
    // 删除元素
    let last = numbers.pop();  // 删除并返回最后一个元素
    let removed = numbers.remove(1);  // 删除索引1的元素
    
    println!("删除的元素: {:?}, {}", last, removed);
    println!("当前向量: {:?}", numbers);
    
    // 查找元素
    if let Some(index) = numbers.iter().position(|&x| x == 3) {
        println!("元素3在索引: {}", index);
    }
    
    // 排序
    numbers.sort();
    println!("排序后: {:?}", numbers);
    
    // 反转
    numbers.reverse();
    println!("反转后: {:?}", numbers);
}
```

## 练习1：学生成绩管理

```rust
#[derive(Debug)]
struct Student {
    name: String,
    scores: Vec<f64>,
}

impl Student {
    fn new(name: String) -> Student {
        Student {
            name,
            scores: Vec::new(),
        }
    }
    
    fn add_score(&mut self, score: f64) {
        if score >= 0.0 && score <= 100.0 {
            self.scores.push(score);
        } else {
            println!("分数必须在0-100之间");
        }
    }
    
    fn average_score(&self) -> Option<f64> {
        if self.scores.is_empty() {
            None
        } else {
            let sum: f64 = self.scores.iter().sum();
            Some(sum / self.scores.len() as f64)
        }
    }
    
    fn highest_score(&self) -> Option<f64> {
        self.scores.iter().cloned().fold(None, |max, score| {
            Some(max.map_or(score, |m| if score > m { score } else { m }))
        })
    }
    
    fn lowest_score(&self) -> Option<f64> {
        self.scores.iter().cloned().fold(None, |min, score| {
            Some(min.map_or(score, |m| if score < m { score } else { m }))
        })
    }
}

fn main() {
    let mut student = Student::new(String::from("张三"));
    
    // 添加成绩
    student.add_score(85.5);
    student.add_score(92.0);
    student.add_score(78.5);
    student.add_score(96.0);
    student.add_score(88.5);
    
    println!("学生: {:?}", student);
    
    if let Some(avg) = student.average_score() {
        println!("平均分: {:.2}", avg);
    }
    
    if let Some(highest) = student.highest_score() {
        println!("最高分: {:.2}", highest);
    }
    
    if let Some(lowest) = student.lowest_score() {
        println!("最低分: {:.2}", lowest);
    }
}
```

## HashMap（哈希映射）

### 基本使用

```rust
use std::collections::HashMap;

fn main() {
    // 创建HashMap
    let mut scores = HashMap::new();
    
    // 插入键值对
    scores.insert(String::from("Blue"), 10);
    scores.insert(String::from("Yellow"), 50);
    
    // 访问值
    let team_name = String::from("Blue");
    let score = scores.get(&team_name);
    println!("Blue队的分数: {:?}", score);
    
    // 遍历HashMap
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
    
    // 更新值
    scores.insert(String::from("Blue"), 25);  // 覆盖
    scores.entry(String::from("Red")).or_insert(30);  // 如果不存在则插入
    
    println!("更新后的分数: {:?}", scores);
}
```

### HashMap的常用方法

```rust
use std::collections::HashMap;

fn main() {
    let mut map = HashMap::new();
    
    // 插入数据
    map.insert("apple", 5);
    map.insert("banana", 3);
    map.insert("orange", 8);
    
    // 检查键是否存在
    if map.contains_key("apple") {
        println!("有苹果");
    }
    
    // 获取值（如果存在）
    if let Some(count) = map.get("banana") {
        println!("香蕉数量: {}", count);
    }
    
    // 更新值
    map.insert("apple", 10);  // 覆盖
    map.entry("grape").or_insert(2);  // 如果不存在则插入
    
    // 根据旧值更新
    let text = "hello world wonderful world";
    let mut word_count = HashMap::new();
    
    for word in text.split_whitespace() {
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }
    
    println!("单词计数: {:?}", word_count);
}
```

## 练习2：单词频率统计

```rust
use std::collections::HashMap;

fn main() {
    let text = "the quick brown fox jumps over the lazy dog the fox is quick";
    
    let word_freq = count_words(text);
    
    println!("文本: {}", text);
    println!("单词频率:");
    for (word, count) in &word_freq {
        println!("{}: {}", word, count);
    }
    
    // 找出最频繁的单词
    if let Some((most_frequent, max_count)) = word_freq.iter()
        .max_by_key(|(_, count)| *count) {
        println!("最频繁的单词: '{}' (出现{}次)", most_frequent, max_count);
    }
}

fn count_words(text: &str) -> HashMap<String, usize> {
    let mut word_count = HashMap::new();
    
    for word in text.split_whitespace() {
        let word = word.to_lowercase();
        let count = word_count.entry(word).or_insert(0);
        *count += 1;
    }
    
    word_count
}
```

## 练习3：电话簿

```rust
use std::collections::HashMap;

#[derive(Debug)]
struct Contact {
    name: String,
    phone: String,
    email: String,
}

struct PhoneBook {
    contacts: HashMap<String, Contact>,
}

impl PhoneBook {
    fn new() -> PhoneBook {
        PhoneBook {
            contacts: HashMap::new(),
        }
    }
    
    fn add_contact(&mut self, contact: Contact) {
        let name = contact.name.clone();
        self.contacts.insert(name, contact);
    }
    
    fn get_contact(&self, name: &str) -> Option<&Contact> {
        self.contacts.get(name)
    }
    
    fn remove_contact(&mut self, name: &str) -> Option<Contact> {
        self.contacts.remove(name)
    }
    
    fn list_contacts(&self) {
        println!("电话簿:");
        for (name, contact) in &self.contacts {
            println!("姓名: {}, 电话: {}, 邮箱: {}", 
                    name, contact.phone, contact.email);
        }
    }
    
    fn search_by_phone(&self, phone: &str) -> Option<&Contact> {
        self.contacts.values().find(|contact| contact.phone == phone)
    }
}

fn main() {
    let mut phone_book = PhoneBook::new();
    
    // 添加联系人
    phone_book.add_contact(Contact {
        name: String::from("张三"),
        phone: String::from("13800138000"),
        email: String::from("zhangsan@example.com"),
    });
    
    phone_book.add_contact(Contact {
        name: String::from("李四"),
        phone: String::from("13900139000"),
        email: String::from("lisi@example.com"),
    });
    
    // 列出所有联系人
    phone_book.list_contacts();
    
    // 查找联系人
    if let Some(contact) = phone_book.get_contact("张三") {
        println!("找到联系人: {:?}", contact);
    }
    
    // 通过电话查找
    if let Some(contact) = phone_book.search_by_phone("13900139000") {
        println!("通过电话找到: {:?}", contact);
    }
    
    // 删除联系人
    if let Some(removed) = phone_book.remove_contact("李四") {
        println!("已删除联系人: {:?}", removed);
    }
    
    println!("删除后的电话簿:");
    phone_book.list_contacts();
}
```

## 练习4：购物车

```rust
use std::collections::HashMap;

#[derive(Debug, Clone)]
struct Product {
    name: String,
    price: f64,
    description: String,
}

#[derive(Debug)]
struct CartItem {
    product: Product,
    quantity: u32,
}

impl CartItem {
    fn new(product: Product, quantity: u32) -> CartItem {
        CartItem { product, quantity }
    }
    
    fn total_price(&self) -> f64 {
        self.product.price * self.quantity as f64
    }
}

struct ShoppingCart {
    items: HashMap<String, CartItem>,
}

impl ShoppingCart {
    fn new() -> ShoppingCart {
        ShoppingCart {
            items: HashMap::new(),
        }
    }
    
    fn add_item(&mut self, product: Product, quantity: u32) {
        let product_name = product.name.clone();
        let cart_item = self.items.entry(product_name.clone())
            .or_insert(CartItem::new(product, 0));
        cart_item.quantity += quantity;
    }
    
    fn remove_item(&mut self, product_name: &str) -> Option<CartItem> {
        self.items.remove(product_name)
    }
    
    fn update_quantity(&mut self, product_name: &str, quantity: u32) {
        if let Some(item) = self.items.get_mut(product_name) {
            item.quantity = quantity;
        }
    }
    
    fn total_price(&self) -> f64 {
        self.items.values().map(|item| item.total_price()).sum()
    }
    
    fn list_items(&self) {
        println!("购物车内容:");
        for (name, item) in &self.items {
            println!("商品: {}, 数量: {}, 单价: {:.2}, 小计: {:.2}", 
                    name, item.quantity, item.product.price, item.total_price());
        }
        println!("总价: {:.2}", self.total_price());
    }
}

fn main() {
    let mut cart = ShoppingCart::new();
    
    // 创建商品
    let laptop = Product {
        name: String::from("笔记本电脑"),
        price: 5999.0,
        description: String::from("高性能游戏本"),
    };
    
    let mouse = Product {
        name: String::from("无线鼠标"),
        price: 99.0,
        description: String::from("蓝牙无线鼠标"),
    };
    
    let keyboard = Product {
        name: String::from("机械键盘"),
        price: 299.0,
        description: String::from("青轴机械键盘"),
    };
    
    // 添加商品到购物车
    cart.add_item(laptop, 1);
    cart.add_item(mouse, 2);
    cart.add_item(keyboard, 1);
    
    // 显示购物车
    cart.list_items();
    
    // 更新数量
    cart.update_quantity("无线鼠标", 3);
    println!("\n更新鼠标数量后:");
    cart.list_items();
    
    // 删除商品
    cart.remove_item("机械键盘");
    println!("\n删除键盘后:");
    cart.list_items();
}
```

## 练习5：简单数据库

```rust
use std::collections::HashMap;

#[derive(Debug, Clone)]
struct Record {
    id: u32,
    name: String,
    age: u32,
    email: String,
}

struct Database {
    records: HashMap<u32, Record>,
    next_id: u32,
}

impl Database {
    fn new() -> Database {
        Database {
            records: HashMap::new(),
            next_id: 1,
        }
    }
    
    fn insert(&mut self, name: String, age: u32, email: String) -> u32 {
        let id = self.next_id;
        let record = Record {
            id,
            name,
            age,
            email,
        };
        self.records.insert(id, record);
        self.next_id += 1;
        id
    }
    
    fn get(&self, id: u32) -> Option<&Record> {
        self.records.get(&id)
    }
    
    fn update(&mut self, id: u32, name: Option<String>, age: Option<u32>, email: Option<String>) -> bool {
        if let Some(record) = self.records.get_mut(&id) {
            if let Some(name) = name {
                record.name = name;
            }
            if let Some(age) = age {
                record.age = age;
            }
            if let Some(email) = email {
                record.email = email;
            }
            true
        } else {
            false
        }
    }
    
    fn delete(&mut self, id: u32) -> Option<Record> {
        self.records.remove(&id)
    }
    
    fn list_all(&self) {
        println!("数据库中的所有记录:");
        for (id, record) in &self.records {
            println!("ID: {}, 记录: {:?}", id, record);
        }
    }
    
    fn search_by_name(&self, name: &str) -> Vec<&Record> {
        self.records.values()
            .filter(|record| record.name.contains(name))
            .collect()
    }
}

fn main() {
    let mut db = Database::new();
    
    // 插入记录
    let id1 = db.insert(String::from("张三"), 25, String::from("zhangsan@example.com"));
    let id2 = db.insert(String::from("李四"), 30, String::from("lisi@example.com"));
    let id3 = db.insert(String::from("王五"), 28, String::from("wangwu@example.com"));
    
    println!("插入的记录ID: {}, {}, {}", id1, id2, id3);
    
    // 列出所有记录
    db.list_all();
    
    // 查找记录
    if let Some(record) = db.get(id1) {
        println!("\n找到记录: {:?}", record);
    }
    
    // 更新记录
    db.update(id1, Some(String::from("张三丰")), Some(26), None);
    println!("\n更新后的记录:");
    if let Some(record) = db.get(id1) {
        println!("{:?}", record);
    }
    
    // 搜索记录
    let results = db.search_by_name("张");
    println!("\n搜索包含'张'的记录:");
    for record in results {
        println!("{:?}", record);
    }
    
    // 删除记录
    if let Some(deleted) = db.delete(id2) {
        println!("\n已删除记录: {:?}", deleted);
    }
    
    println!("\n删除后的数据库:");
    db.list_all();
}
```

## 下一步

现在您已经掌握了Rust的主要集合类型。接下来我们将学习错误处理，这是编写健壮程序的重要技能。
