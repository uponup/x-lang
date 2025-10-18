use serde::{Deserialize, Serialize};
use rand::Rng;

#[derive(Serialize, Deserialize, Debug)]
struct Person {
    name: String,
    age: u32,
    email: String,
}

fn main() {
    println!("Cargo示例程序");
    
    // 创建Person实例
    let person = Person {
        name: String::from("张三"),
        age: 25,
        email: String::from("zhangsan@example.com"),
    };
    
    // 序列化为JSON
    let json = serde_json::to_string_pretty(&person).unwrap();
    println!("JSON格式:");
    println!("{}", json);
    
    // 反序列化
    let person2: Person = serde_json::from_str(&json).unwrap();
    println!("反序列化结果: {:?}", person2);
    
    // 使用随机数
    let mut rng = rand::thread_rng();
    let random_number: u32 = rng.gen_range(1..=100);
    println!("随机数: {}", random_number);
    
    // 调用库函数
    let result = cargo_example::add(10, 20);
    println!("10 + 20 = {}", result);
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_person_creation() {
        let person = Person {
            name: String::from("测试"),
            age: 30,
            email: String::from("test@example.com"),
        };
        assert_eq!(person.name, "测试");
        assert_eq!(person.age, 30);
    }
    
    #[test]
    fn test_json_serialization() {
        let person = Person {
            name: String::from("JSON测试"),
            age: 25,
            email: String::from("json@example.com"),
        };
        
        let json = serde_json::to_string(&person).unwrap();
        let person2: Person = serde_json::from_str(&json).unwrap();
        
        assert_eq!(person.name, person2.name);
        assert_eq!(person.age, person2.age);
    }
}
