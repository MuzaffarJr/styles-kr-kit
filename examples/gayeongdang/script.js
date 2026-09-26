const form = document.querySelector('#booking-form');
const checkin = form.elements.checkin;
const checkout = form.elements.checkout;
const room = form.elements.room;
const maxGuests = { '별채 (독채)': 12, '사랑채 꽃내음1실': 5, '사랑채 꽃내음2실': 3 };
document.querySelectorAll('[data-room]').forEach(button => button.addEventListener('click', () => {
  room.value = button.dataset.room;
  room.dispatchEvent(new Event('change'));
  document.querySelector('#reservation').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  room.focus({ preventScroll: true });
}));
function validateGuests() {
  const guests = Number.parseInt(form.elements.guests.value, 10);
  form.elements.guests.setCustomValidity(room.value && guests > maxGuests[room.value] ? '선택한 객실의 최대 인원을 초과합니다. 다른 객실을 선택하거나 숙소에 전화로 문의해 주세요.' : '');
}
room.addEventListener('change', validateGuests);
form.elements.guests.addEventListener('change', validateGuests);
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
checkin.min = localToday;
checkout.min = localToday;
checkin.addEventListener('change', () => {
  const next = new Date(`${checkin.value}T12:00:00`);
  next.setDate(next.getDate() + 1);
  checkout.min = new Date(next.getTime() - next.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (checkout.value && checkout.value <= checkin.value) checkout.value = '';
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  validateGuests();
  if (!form.reportValidity()) return;
  if (checkout.value <= checkin.value) {
    checkout.setCustomValidity('체크아웃 날짜는 체크인 다음 날부터 선택해 주세요.');
    checkout.reportValidity();
    return;
  }
  checkout.setCustomValidity('');
  const data = new FormData(form);
  const name = String(data.get('name')).trim().replace(/[\r\n]/g, ' ');
  const note = String(data.get('note')).trim().replace(/[\r\n]+/g, ' ');
  const message = `[가영당 예약 문의]\n이름: ${name}\n객실: ${data.get('room')}\n체크인: ${data.get('checkin')}\n체크아웃: ${data.get('checkout')}\n인원: ${data.get('guests')}${note ? `\n요청 사항: ${note}` : ''}\n가능 여부와 요금을 안내 부탁드립니다.`;
  document.querySelector('#message-text').textContent = message;
  document.querySelector('#message-fallback').hidden = false;
  document.querySelector('#message-fallback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const smsUrl = `sms:+821099352129?body=${encodeURIComponent(message)}`;
  window.location.href = smsUrl;
});
checkout.addEventListener('change', () => checkout.setCustomValidity(''));
document.querySelector('#copy-message').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText(document.querySelector('#message-text').textContent);
    event.currentTarget.textContent = '복사했습니다';
  } catch {
    window.getSelection()?.selectAllChildren(document.querySelector('#message-text'));
    event.currentTarget.textContent = '내용을 선택했습니다';
  }
});
