import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPin = async (pin: string) => bcrypt.hash(pin, SALT_ROUNDS);

export const verifyPin = async (pin: string, hash: string) => bcrypt.compare(pin, hash);
