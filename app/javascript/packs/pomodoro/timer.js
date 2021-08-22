let button = document.getElementById('start')
let reset_button = document.getElementById('reset')
let test_button = document.getElementById('test')

button.addEventListener('click', setCountDown);
reset_button.addEventListener('click', resetTimer);
test_button.addEventListener('click', test);

// 定数
const REST_SEC = 0
var isCancelled = false

// テスト用関数
function test() {
  function startCountDown() {
    fetch('http://localhost:3333/pomodoros', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
                'X-CSRF-Token': getCsrfToken()
      },
    });
  }

  const getCsrfToken = () => {
    const metas = document.getElementsByTagName('meta');
    for (let meta of metas) {
        if (meta.getAttribute('name') === 'csrf-token') {
            console.log('csrf-token:', meta.getAttribute('content'));
            return meta.getAttribute('content');
        }
    }
    return '';
  }

  startCountDown()
}

// 設定時間を取得
function getRestMin() {
  const restMin = parseInt(document.getElementById('set_munites').value || 0);
  return restMin;
}

// リセット関数
function resetTimer() {
  console.log(getRestMin())
  console.log(isCancelled)
  isCancelled = true
  // HTMLに書き込む
  let min_text = document.getElementById('minute')
  let sec_text = document.getElementById('sec')
  min_text.innerText = getRestMin();
  sec_text.innerText = REST_SEC;
}

// ボタンを押された際に発火するイベント
function setCountDown() {
  isCancelled = false;
  // 現在時刻をミリ秒切り捨てで取得
  const start_time = new Date
  // 終了予定時刻をミリ秒切り捨てで取得
  const end_time = new Date(start_time.setMinutes(start_time.getMinutes() + getRestMin()))
  const end_year = end_time.getFullYear()
  const end_month = end_time.getMonth()
  const end_date = end_time.getDate();
  const end_hour = end_time.getHours();
  const end_min = end_time.getMinutes();
  const end_sec = end_time.getSeconds();
  const _end = new Date(end_year, end_month, end_date, end_hour, end_min, end_sec)
  
  // sleep関数を定義
  const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  async function startCountDown() {
    // 計測秒数の数だけループを回す
    while (true) {
      // リセットボタンを押されたら中止
      if (isCancelled) {
        break;
      }
      // ループ内処理
      // 残り秒数を、「終了予定時刻 - 現在時刻」で算出
      let diff = (_end.getTime() - new Date().getTime()) / 1000
      // 残り秒数を分と秒に分解
      let rest_min = Math.floor(diff % (24 * 60 * 60) % (60 * 60) / 60);
      let rest_sec = Math.floor(diff % (24 * 60 * 60) % (60 * 60) % 60);
      // HTMLに書き込む
      let min_text = document.getElementById('minute')
      let sec_text = document.getElementById('sec')
      min_text.innerText = rest_min;
      sec_text.innerText = rest_sec;
      // 残り秒数が0でなければ続行
      console.log(rest_min);
      console.log(rest_sec);
      if (rest_min <= 0 && rest_sec <= 0) {
        fetch('http://localhost:3333/pomodoros', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
                    'X-CSRF-Token': getCsrfToken()
          },
        });
        break;
      } else {
        // 1秒待機
        await _sleep(1000);
      }
    }
  }

  const getCsrfToken = () => {
    const metas = document.getElementsByTagName('meta');
    for (let meta of metas) {
        if (meta.getAttribute('name') === 'csrf-token') {
            console.log('csrf-token:', meta.getAttribute('content'));
            return meta.getAttribute('content');
        }
    }
    return '';
  }

  startCountDown();
}