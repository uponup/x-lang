//! Cargo示例库
//! 
//! 这个库演示了如何在Rust项目中使用Cargo管理依赖和模块

/// 简单的加法函数
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// 简单的乘法函数
pub fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

/// 计算阶乘
pub fn factorial(n: u32) -> u32 {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
        assert_eq!(add(-1, 1), 0);
    }
    
    #[test]
    fn test_multiply() {
        assert_eq!(multiply(3, 4), 12);
        assert_eq!(multiply(0, 100), 0);
    }
    
    #[test]
    fn test_factorial() {
        assert_eq!(factorial(0), 1);
        assert_eq!(factorial(1), 1);
        assert_eq!(factorial(5), 120);
    }
}
