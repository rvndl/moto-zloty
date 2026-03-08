use std::{
    env,
    fmt::{self, Debug},
};

pub struct Env<'a, T> {
    key: &'a str,
    transformer: fn(String) -> T,
    required: bool,
}

impl<'a, T> Env<'a, T>
where
    T: Debug,
{
    pub fn new(key: &'a str, required: bool, transformer: fn(String) -> T) -> Self {
        Env {
            key,
            required,
            transformer,
        }
    }

    pub fn get(&self) -> T {
        let val = match env::var(self.key) {
            Ok(val) => val,
            Err(err) => {
                if self.required {
                    log::error!("{}: {}", self.key, err);
                    std::process::exit(0);
                }

                "".to_string()
            }
        };

        (self.transformer)(val)
    }
}

impl<'a, T> fmt::Debug for Env<'a, T>
where
    T: Debug,
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let val = env::var(self.key).unwrap();
        write!(f, "key: {}, value: {:?}", self.key, (self.transformer)(val))
    }
}
