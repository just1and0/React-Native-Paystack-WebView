"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannels = exports.getAmountValueInKobo = exports.toAmountInKobo = exports.toString = exports.toNumber = exports.isNegative = exports.isValidDecimalMonetaryValue = exports.isValidStringAmount = void 0;
const validator_1 = __importDefault(require("validator"));
const { isDecimal, isFloat, isInt, toFloat, toInt } = validator_1.default;
function isNumber(value) {
    return typeof value === 'number';
}
function isString(value) {
    return typeof value === 'string';
}
function isValidStringAmount(stringAmount) {
    if (isString(stringAmount) && stringAmount?.endsWith('.')) {
        return false;
    }
    return isDecimal(stringAmount);
}
exports.isValidStringAmount = isValidStringAmount;
function isValidDecimalMonetaryValue(amountValue) {
    if (!isNumber(amountValue) && !isString(amountValue)) {
        return false;
    }
    return isNumber(amountValue) || isValidStringAmount(amountValue);
}
exports.isValidDecimalMonetaryValue = isValidDecimalMonetaryValue;
function isNegative(amountValue) {
    if (typeof amountValue === 'string') {
        return amountValue.startsWith('-');
    }
    return amountValue < 0;
}
exports.isNegative = isNegative;
function toNumber(string) {
    if (isFloat(string)) {
        return toFloat(string);
    }
    if (isInt(string)) {
        return toInt(string);
    }
    return +string;
}
exports.toNumber = toNumber;
function toString(amountValue) {
    return isNumber(amountValue) ? amountValue.toString() : amountValue;
}
exports.toString = toString;
function toAmountInKobo(amountValue) {
    if (typeof amountValue === 'string') {
        return toNumber(amountValue) * 100;
    }
    return amountValue * 100;
}
exports.toAmountInKobo = toAmountInKobo;
const getAmountValueInKobo = (amount) => {
    if (isValidDecimalMonetaryValue(amount)) {
        return toAmountInKobo(amount);
    }
    return 0;
};
exports.getAmountValueInKobo = getAmountValueInKobo;
const getChannels = (channelsArrary) => {
    if (channelsArrary?.length > 0) {
        const channelsString = JSON.stringify(channelsArrary);
        return `channels: ${channelsString},`;
    }
    return '';
};
exports.getChannels = getChannels;
//# sourceMappingURL=helper.js.map