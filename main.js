let display = document.getElementById("display");
let displayValue = "";

let tail = ""; // 末尾の種類
let valueZero = false; // 末尾の値が0であるか
let parenNum = 0; // 閉じられていない ( の個数
let dotNum = 0; // 小数点の数

// 計算
function clickBtn(type, value) {
    // 数字
    if (type === 'num') {
        if (["", "num", "op", "(", "."].includes(tail)) {
            // 「00」「01」等対策
            if (valueZero) {
                displayValue = displayValue.slice(0, -1);
            }
            if (value === '0') {
                if (["", "op", "("].includes(tail)) {
                    valueZero = true;
                } else {
                    valueZero = false;
                }
            } else {
                valueZero = false;
            }

            displayValue += value;
            tail = "num";
        }
        if (["="].includes(tail)) {
            displayValue = value;
            tail = "num";
        }
    }

    // 演算子
    if (type === 'op') {
        if (value === '=') {
            while (["op", ".", "("].includes(tail)) {
                backSpace();
            }

            displayValue = displayValue.replace("×", "*");
            displayValue = String(Function('return ('+displayValue+');')());
            tail = "=";

            // 小数点カウントリセット
            let checkValue = displayValue;
            dotNum = 0;
            while (checkValue) {
                if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(checkValue.slice(-1))) {
                    checkValue = checkValue.slice(0, -1);
                } else if (["."].includes(checkValue.slice(-1))) {
                    dotNum = 1;
                    break;
                } else {
                    break;
                }
            }

        // 四則演算
        } else {
            if (["num", ")", "="].includes(tail)) {
                // displayValueが空なら何もしない
                if (displayValue) {
                    if (tail === "op") {
                        displayValue = displayValue.slice(0, -1);
                    }

                    displayValue += value;
                    tail = "op";
                    dotNum = 0;
                }
            }
        }
    }

    // 数字、演算子以外
    if (type === 'other') {
        if (value === 'c') {
            displayValue = "";
            tail = "";
            dotNum = 0;
        }

        if (value === 'bs') {
            backSpace();
        }
        
        if (value === '(') {
            if (["op", "("].includes(tail)) {
                displayValue += value;
                parenNum++;
                tail = "(";
            }
        }
        
        if (value === ')') {
            if (["num", ")"].includes(tail)) {
                if (parenNum) {
                    displayValue += value;
                    parenNum--;
                    tail = ")";
                }
            }
        }
        
        if (value === '.') {
            if (["num"].includes(tail)) {
                if (dotNum === 0) {
                    displayValue += value;
                    tail = ".";
                    dotNum = 1;
                }
            }
        }
    }

    // 最後、displayValueを表示に反映
    display.value = displayValue;
}

// Back Space用
function backSpace() {
    // 小数点カウントリセット
    let checkValue = displayValue;
    dotNum = 0;
    while (checkValue) {
        if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(checkValue.slice(-1))) {
            checkValue = checkValue.slice(0, -1);
        } else if (["."].includes(checkValue.slice(-1))) {
            dotNum = 1;
            break;
        } else {
            break;
        }
    }

    displayValue = displayValue.slice(0, -1);

    // BS後の0反映
    if (["0"].includes(displayValue.slice(-1))) {
        if (displayValue.length === 2) {
            valueZero = true;
        } else if (["+", "-", "×", "/", "("].includes(displayValue.slice(-2))) {
            valueZero = true;
        } else {
            valueZero = false;
        }
    }

    // BS後の末尾反映
    if (displayValue === "") tail = "";
    if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(displayValue.slice(-1))) tail = "num";
    if (["+", "-", "×", "/"].includes(displayValue.slice(-1))) tail = "op";
    if (["("].includes(displayValue.slice(-1))) tail = "(";
    if ([")"].includes(displayValue.slice(-1))) tail = ")";
    if (["."].includes(displayValue.slice(-1))) tail = ".";
}

// エラー表示
function errorMessage() {
    // 「ERROR」を0.5秒表示
    // 「display.value = "ERROR";」はできなかった
    let keep = displayValue;
    displayValue = "ERROR";
    display.value = displayValue;
    setTimeout(() => {
        displayValue = keep;
        display.value = displayValue;
    }, 500);
}