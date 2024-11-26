pub type RangeBoundary = (usize, usize);

pub enum RangeValidationStatus {
    TooShort,
    TooLong,
    Valid,
}

pub trait RangeValidation {
    fn in_range(&self, boundary: RangeBoundary) -> RangeValidationStatus;
}

impl RangeValidation for String {
    fn in_range(&self, (min, max): RangeBoundary) -> RangeValidationStatus {
        if self.len() < min {
            return RangeValidationStatus::TooShort;
        }

        if self.len() > max {
            return RangeValidationStatus::TooLong;
        }

        RangeValidationStatus::Valid
    }
}
