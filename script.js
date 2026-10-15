/**
 * ==========================================================================
 * indesign plus CEO 신은호 모바일 명함 스크립트 (script.js)
 * 
 * - 주요 기능:
 *   1. 명함 이미지 터치 시 즉시 전화 걸기 (010-8691-2938)
 *   2. 주소록 저장 (vCard 파일 다운로드)
 *   3. 사무실 주소 원터치 복사
 *   4. 카카오톡 및 SNS 명함 공유하기
 *   5. 카카오톡 인앱 브라우저에서 공식 홈페이지(HTTP) 및 외부 링크 완벽 지원
 * ==========================================================================
 */

// 대표님 기본 연락처 정보 상수
const CONTACT_INFO = {
  name: "신은호 대표",
  company: "indesign plus",
  title: "CEO",
  phone: "010-8691-2938",
  cleanPhone: "01086912938",
  email: "eunho2546@naver.com",
  address: "강원특별자치도 속초시 수복로85, 1층(교동)",
  website: "http://www.indesignplus.co.kr/main/",
  naverMap: "https://map.naver.com/v5/search/%EA%B0%95%EC%9B%90%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84%20%EC%86%8D%EC%B4%88%EC%8B%9C%20%EC%88%98%EB%B3%B5%EB%A1%9C85",
  deployUrl: "https://alvin717.github.io/card-shin/"
};

// DOM이 완전히 로드된 후 실행
document.addEventListener("DOMContentLoaded", () => {
  initTouchCall();
  initContactSave();
  initCopyAddress();
  initExternalLinks();
  initShareFeatures();
});

/**
 * 1. [핵심 기능] 명함 이미지 터치 시 즉시 전화 연결
 */
function initTouchCall() {
  const cardTouchArea = document.getElementById("cardTouchArea");
  if (!cardTouchArea) return;

  // 터치 시 피드백 알림 후 전화 연결
  cardTouchArea.addEventListener("click", () => {
    showToast("📞 신은호 대표에게 전화를 연결합니다...");
  });
}

/**
 * 2. 외부 웹사이트 및 지도 링크 처리
 * - 카카오톡 인앱 브라우저는 HTTP 웹사이트를 보안상 차단하거나 새 탭을 안 띄우므로
 *   카카오톡 전용 외부 브라우저 호출 스킴(openExternal)을 사용하여 스마트폰 기본 브라우저(사파리/크롬)로 100% 안전하게 열어줍니다.
 */
function initExternalLinks() {
  const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent);

  // 공식 웹사이트 링크
  const btnWebsite = document.getElementById("btnWebsite");
  if (btnWebsite) {
    btnWebsite.addEventListener("click", (e) => {
      if (isKakaoTalk) {
        e.preventDefault();
        // 카카오톡 외부 브라우저 열기 호출
        window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(CONTACT_INFO.website)}`;
      }
    });
  }

  // 네이버 지도 링크
  const btnNaverMap = document.getElementById("btnNaverMap");
  if (btnNaverMap) {
    btnNaverMap.addEventListener("click", (e) => {
      if (isKakaoTalk) {
        e.preventDefault();
        window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(CONTACT_INFO.naverMap)}`;
      }
    });
  }
}

/**
 * 3. 스마트폰 주소록 저장 기능 (vCard .vcf 파일 생성)
 */
function initContactSave() {
  const btnSaveContact = document.getElementById("btnSaveContact");
  if (!btnSaveContact) return;

  btnSaveContact.addEventListener("click", () => {
    showToast("👤 연락처가 다운로드되었습니다. [열기] 후 [저장]을 눌러주세요!");
  });
}

/**
 * 4. 사무실 주소 원터치 복사 기능
 */
function initCopyAddress() {
  const btnCopyAddress = document.getElementById("btnCopyAddress");
  if (!btnCopyAddress) return;

  btnCopyAddress.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(CONTACT_INFO.address);
      } else {
        const tempInput = document.createElement("input");
        tempInput.value = CONTACT_INFO.address;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }
      showToast("📍 주소가 복사되었습니다! (내비게이션에 붙여넣기)");
    } catch (err) {
      showToast("📍 사무실 주소: " + CONTACT_INFO.address);
    }
  });
}

/**
 * 5. 명함 공유하기 (카카오톡 및 링크 복사)
 */
function initShareFeatures() {
  const btnShareKakao = document.getElementById("btnShareKakao");
  const btnShareLink = document.getElementById("btnShareLink");

  // 실제 공유할 명함 웹페이지 주소
  const shareUrl = CONTACT_INFO.deployUrl;

  const shareTitle = `[indesign plus] CEO 신은호 모바일 명함`;
  const shareText = `indesign plus CEO 신은호 공식 모바일 명함입니다.\n(터치 시 010-8691-2938 로 즉시 통화 연결)\n📍 주소: ${CONTACT_INFO.address}`;

  // 카카오톡 공유 버튼
  if (btnShareKakao) {
    btnShareKakao.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          });
        } catch (err) {
          // 공유 취소 시
        }
      } else {
        copyToClipboard(shareUrl, "💬 명함 인터넷 주소가 복사되었습니다! 카카오톡에 붙여넣어 전송하세요.");
      }
    });
  }

  // 링크 복사 버튼
  if (btnShareLink) {
    btnShareLink.addEventListener("click", () => {
      copyToClipboard(shareUrl, "🔗 명함 인터넷 주소가 복사되었습니다!");
    });
  }
}

/**
 * 클립보드 복사 헬퍼 함수
 */
async function copyToClipboard(text, successMsg) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempInput = document.createElement("input");
      tempInput.value = text;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
    }
    showToast(successMsg);
  } catch (err) {
    showToast("링크 복사에 실패했습니다. 주소창을 복사해주세요.");
  }
}

/**
 * 화면 상단 토스트 알림 표시
 */
let toastTimeout = null;
function showToast(message) {
  const toast = document.getElementById("toastPopup");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
