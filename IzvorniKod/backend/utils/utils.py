import re

# check if there are missing fields
def validate_required_fields(data, required_fields):
    missing_fields = [field for field in required_fields if field not in data]
    return missing_fields

# check if required_fields are empty
def validate_empty_fields(data, required_fields):
    empty_fields = [field for field in required_fields if data[field] == ""]
    return empty_fields

# check if OIB or MBO is in right format
def validate_number(number, length):
    pattern = re.compile(r'^\d{' + str(length) + '}$')
    return bool(pattern.match(number))