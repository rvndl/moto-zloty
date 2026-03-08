macro_rules! define_repo {
    ($repo_name:ident) => {
        pub struct $repo_name<'a> {
            db: &'a $crate::db::DbPool,
        }

        impl<'a> $repo_name<'a> {
            pub fn new(db: &'a $crate::db::DbPool) -> Self {
                Self { db }
            }
        }
    };
}

pub(crate) use define_repo;
