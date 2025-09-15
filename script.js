function generateRandomNumber() {
  const digits = [];
  while (digits.length < 3) {
    const rand = Math.floor(Math.random() * 10);
    if (!digits.includes(rand)) digits.push(rand);
  }
  console.log("정답 : " + digits.join(''));
  return digits;
}

function judge(inputArr, answerArr) {
  let strikes = 0;
  let balls = 0;
  for (let i = 0; i < inputArr.length; i++) {
    if (inputArr[i] === answerArr[i]) strikes++;
    else if (answerArr.includes(inputArr[i])) balls++;
  }
  return { strikes, balls };
}

const inputEl = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const resultDiv = document.getElementById('result');
const historyDiv = document.getElementById('history');

let answer = generateRandomNumber();
const history = [];

function showAlert(message) {
  Swal.fire({
    icon: 'warning',
    title: '알림',
    text: message,
    confirmButtonColor: '#2575fc',
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
}

submitBtn.addEventListener('click', () => {
  const input = inputEl.value.trim().split('').map(Number);

  // 유효성 검사
  if (input.length !== 3 || input.some(isNaN)) {
    showAlert('3자리 숫자를 올바르게 입력하세요.');
    return;
  }
  if (new Set(input).size !== 3) {
    showAlert('중복없는 숫자를 입력하세요.');
    return;
  }

  const { strikes, balls } = judge(input, answer);
  // 히스토리 객체 저장
  history.push({
    numbers: input.join(''),
    strikes,
    balls
  });

  if (strikes === 3) {
    resultDiv.textContent = `🎉 정답 !! ${history.length}번만에 맞추셨네요! 🎉`;
    submitBtn.disabled = true;
  } else {
    resultDiv.innerHTML = `⚾ <b>${strikes} 스트라이크, ${balls} 볼</b>입니다.`;
  }

  // 히스토리 출력 (넓은 레이아웃, 판정 강조)
  historyDiv.innerHTML = history.map(item => `
    <div class="history-row">
      <span class="history-numbers">${[...item.numbers].map(x => `<span class="num-circle">${x}</span>`).join('')}</span>
      <span class="history-result">
        ${item.strikes ? `<span class="strike"><span class="icon">⚡</span> ${item.strikes} 스트라이크</span>` : ""}
        ${item.balls ? `<span class="ball"><span class="icon">🟡</span> ${item.balls} 볼</span>` : ""}
        ${(!item.strikes && !item.balls) ? `<span class="empty">아웃</span>` : ""}
      </span>
    </div>
  `).join('');

  inputEl.value = '';
  inputEl.focus();
});

resetBtn.addEventListener('click', () => {
  answer = generateRandomNumber();
  history.length = 0;
  submitBtn.disabled = false;
  inputEl.value = '';
  resultDiv.textContent = '';
  historyDiv.textContent = '';
  inputEl.focus();
});