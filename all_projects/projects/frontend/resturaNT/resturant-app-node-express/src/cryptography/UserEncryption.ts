import bcrypt from 'bcryptjs';

const salt = async () => bcrypt.genSalt(10);

async function encrypt(password: string) {
    const hash = await bcrypt.hash(password, await salt());
    return hash;
}

async function decrypt(enteredPassword: string, userPassword: string) {
    const compare = await bcrypt.compare(enteredPassword, userPassword);
    return compare;
}

export default { encrypt, decrypt };
