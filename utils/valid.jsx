const valid = (name, email, password, cfpassword) => {
    if (!name || !email || !password || !cfpassword) {
        return 'Xin hãy nhập đầy đủ dữ liệu!!';
    }
    if (!validateEmail(email)) {
        return 'Email không hợp lệ';

    }

    if (password.length < 6) {
        return 'Password phải nhiều hơn 6 kí tự'
    }
    if (password !== cfpassword) {
        return 'xác nhận mật khẩu không Đúng'
    }
}
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};
export default valid