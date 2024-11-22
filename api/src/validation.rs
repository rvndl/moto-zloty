pub type RangeBoundary = (usize, usize);

pub enum RangeValidationStatus {
    TooShort,
    TooLong,
    Valid,
}

pub trait RangeValidation {
    fn in_range(&self, boundaries: (usize, usize)) -> RangeValidationStatus;
}

impl RangeValidation for String {
    fn in_range(&self, (min, max): (usize, usize)) -> RangeValidationStatus {
        if self.len() < min {
            return RangeValidationStatus::TooShort;
        }

        if self.len() > max {
            return RangeValidationStatus::TooLong;
        }

        RangeValidationStatus::Valid
    }
}
