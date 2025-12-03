// =====================================================
// 환경 감지
// 브라우저 / Node 환경에서 모두 사용할 수 있도록 분기 처리합니다.
// =====================================================
const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

// =====================================================
// 게시글 데이터
// - 이 배열을 수정하면 홈 화면의 카드 내용이 바뀝니다.
// - thumbnail 경로를 원하는 이미지 URL로 교체하면 됩니다.
// =====================================================
const posts = [
  {
    title: "JavaScript 비동기 처리 완전 정리",
    date: "2025-01-12",
    excerpt:
      "콜백, 프로미스, async/await까지 자바스크립트 비동기 처리 패턴을 한 번에 정리했습니다.",
    tags: ["JavaScript", "Frontend"],
    thumbnail:
      "https://via.placeholder.com/640x400?text=Async+JavaScript+Post",
    link: "#"
  },
  {
    title: "사이드 프로젝트로 1년간 배운 것들",
    date: "2025-01-05",
    excerpt:
      "완성되지 못해도 괜찮다는 마음가짐으로 시작한 사이드 프로젝트에서 배운 실질적인 교훈들.",
    tags: ["Life", "Frontend"],
    thumbnail:
      "https://via.placeholder.com/640x400?text=Side+Project+Journey",
    link: "#"
  },
  {
    title: "React 없이도 충분히 멋진 인터랙션 만들기",
    date: "2024-12-29",
    excerpt:
      "순수 HTML/CSS/JS만으로도 만들 수 있는 인터랙션 예시들과 구조 설계 방법을 소개합니다.",
    tags: ["JavaScript", "Frontend"],
    thumbnail:
      "https://via.placeholder.com/640x400?text=Vanilla+JS+Interactions",
    link: "#"
  },
  {
    title: "개발자 라이프로그: 나만의 기록 시스템 만들기",
    date: "2024-12-20",
    excerpt:
      "메모, 블로그, 깃허브를 어떻게 연결해서 나만의 성장 기록 시스템을 만드는지 공유합니다.",
    tags: ["Life"],
    thumbnail:
      "https://via.placeholder.com/640x400?text=Developer+Life+Log",
    link: "#"
  },
  {
    title: "CSS로 만드는 모던한 카드 UI 디자인",
    date: "2024-12-10",
    excerpt:
      "최근 트렌드를 반영한 카드 UI를 CSS만으로 구현하는 방법과 디자인 포인트를 정리했습니다.",
    tags: ["Frontend"],
    thumbnail: "https://via.placeholder.com/640x400?text=Modern+Card+UI",
    link: "#"
  },
  {
    title: "사소하지만 편리한 VS Code 설정 모음",
    date: "2024-11-28",
    excerpt:
      "매일 쓰는 에디터를 조금 더 편하게 만들어주는 VS Code 설정과 확장 프로그램 추천.",
    tags: ["Life", "Frontend"],
    thumbnail:
      "https://via.placeholder.com/640x400?text=VS+Code+Productivity",
    link: "#"
  }
];

// =====================================================
// DOM 렌더링 관련 함수 (브라우저 전용)
// =====================================================

/**
 * 게시글 카드를 감싸는 컨테이너를 반환합니다.
 */
function getPostsContainer() {
  if (!isBrowser) return null;
  return document.getElementById("posts-container");
}

/**
 * "결과 없음" 메시지 요소를 반환합니다.
 */
function getNoPostsMessageEl() {
  if (!isBrowser) return null;
  return document.getElementById("no-posts-message");
}

/**
 * 주어진 post 데이터를 바탕으로 카드 요소의 HTML 문자열을 반환합니다.
 */
function createPostCardHTML(post) {
  const primaryTag = post.tags?.[0] || "Post";

  return `
    <article class="post-card">
      <div class="post-thumbnail">
        <!-- 썸네일 이미지를 변경하고 싶다면 thumbnail 값을 수정하세요 -->
        <img src="${post.thumbnail}" alt="${escapeHtml(
    post.title
  )} 썸네일 이미지" />
        <span class="post-tag">${escapeHtml(primaryTag)}</span>
      </div>
      <div class="post-body">
        <div class="post-meta">
          <span><span>📅</span><time datetime="${escapeHtml(
            post.date
          )}">${escapeHtml(post.date)}</time></span>
          <span><span>🏷</span>${post.tags
            .map((tag) => escapeHtml(tag))
            .join(", ")}</span>
        </div>
        <h3 class="post-title">
          <a href="${post.link || "#"}">${escapeHtml(post.title)}</a>
        </h3>
        <p class="post-excerpt">
          ${escapeHtml(post.excerpt)}
        </p>
        <div class="post-footer">
          <a class="read-more" href="${post.link || "#"}">자세히 보기</a>
        </div>
      </div>
    </article>
  `;
}

/**
 * 게시글 리스트 렌더링
 * @param {Array} list 렌더링할 게시글 배열
 */
function renderPosts(list) {
  if (!isBrowser) return;

  const container = getPostsContainer();
  const emptyMessageEl = getNoPostsMessageEl();
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = "";
    if (emptyMessageEl) {
      emptyMessageEl.classList.remove("hidden");
    }
    return;
  }

  if (emptyMessageEl) {
    emptyMessageEl.classList.add("hidden");
  }

  const html = list.map(createPostCardHTML).join("");
  container.innerHTML = html;
}

/**
 * 태그 필터, 검색값에 따라 게시글 배열을 필터링합니다.
 */
function filterPosts({ tag = "all", query = "" } = {}) {
  const normalizedTag = tag;
  const q = query.trim().toLowerCase();

  return posts.filter((post) => {
    // 태그 필터
    const matchTag =
      normalizedTag === "all" ||
      (Array.isArray(post.tags) && post.tags.includes(normalizedTag));

    // 검색어 필터
    const combinedText =
      `${post.title} ${post.excerpt}`.toLowerCase();

    const matchQuery = q === "" || combinedText.includes(q);

    return matchTag && matchQuery;
  });
}

/**
 * 검색 & 태그 필터 이벤트 셋업
 */
function setupFilters() {
  if (!isBrowser) return;

  const searchInput = document.getElementById("search-input");
  const tagButtons = document.querySelectorAll(".tag-filter-btn");

  let currentTag = "all";
  let currentQuery = "";

  const updateView = () => {
    const filtered = filterPosts({
      tag: currentTag,
      query: currentQuery
    });
    renderPosts(filtered);
  };

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentQuery = e.target.value || "";
      updateView();
    });
  }

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tagButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentTag = btn.dataset.tag || "all";
      updateView();
    });
  });

  // 초기 렌더링
  updateView();
}

/**
 * 푸터의 연도 표시 초기화
 */
function setupFooterYear() {
  if (!isBrowser) return;
  const el = document.getElementById("footer-year");
  if (!el) return;
  const year = new Date().getFullYear();
  el.textContent = String(year);
}

// =====================================================
// 간단한 HTML 이스케이프 유틸리티
// (XSS를 방지하면서도 정적 데이터에 안전하게 사용 가능)
// =====================================================
function escapeHtml(text) {
  if (text == null) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// =====================================================
// 브라우저 환경 테스트 (DOM 기반 간단 테스트)
// - 결과는 브라우저 콘솔에서 확인할 수 있습니다.
// =====================================================
function runBrowserTests() {
  if (!isBrowser) return;

  console.group("[Browser Tests]");

  try {
    const container = getPostsContainer();
    console.assert(
      container,
      "posts-container 엘리먼트가 존재해야 합니다."
    );

    const cards = document.querySelectorAll(".post-card");
    console.assert(
      cards.length > 0,
      "최소 1개 이상의 .post-card 요소가 렌더링되어야 합니다."
    );

    console.log("✅ 브라우저 DOM 테스트 통과");
  } catch (error) {
    console.error("❌ 브라우저 테스트 실패:", error);
  } finally {
    console.groupEnd();
  }
}

// =====================================================
// Node 환경용 데이터 유효성 검증 & 테스트
// - GitHub Actions에서 이 부분을 실행합니다.
// =====================================================

/**
 * posts 배열의 구조를 검증합니다.
 */
function validatePostsData() {
  const errors = [];

  if (!Array.isArray(posts)) {
    errors.push("posts가 배열이 아닙니다.");
  } else if (posts.length === 0) {
    errors.push("posts 배열이 비어 있습니다.");
  }

  posts.forEach((post, index) => {
    if (!post.title) {
      errors.push(`posts[${index}]에 title이 없습니다.`);
    }
    if (!post.date) {
      errors.push(`posts[${index}]에 date가 없습니다.`);
    }
    if (!post.excerpt) {
      errors.push(`posts[${index}]에 excerpt가 없습니다.`);
    }
    if (!post.thumbnail) {
      errors.push(`posts[${index}]에 thumbnail이 없습니다.`);
    }
  });

  return {
    ok: errors.length === 0,
    errors
  };
}

/**
 * Node 환경에서 실행되는 테스트
 * - 데이터 구조 중심으로 검증합니다.
 */
function runNodeTests() {
  console.log("🔍 Node 테스트 실행 시작");

  const result = validatePostsData();
  if (!result.ok) {
    console.error("❌ Node 테스트 실패:");
    result.errors.forEach((err) => console.error("  -", err));

    // GitHub Actions에서 실패 처리
    if (typeof process !== "undefined" && process.exit) {
      process.exit(1);
    }
  } else {
    console.log("✅ Node 테스트 통과: posts 데이터 구조가 올바릅니다.");
  }
}

// Node 환경에서 require 할 수 있도록 export
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    posts,
    validatePostsData,
    runNodeTests
  };
}

// =====================================================
// 초기화 (브라우저만)
// =====================================================
if (isBrowser) {
  window.addEventListener("DOMContentLoaded", () => {
    setupFooterYear();
    setupFilters();
    // DOM 렌더 이후 간단한 브라우저 테스트 실행
    setTimeout(runBrowserTests, 0);
  });
}
