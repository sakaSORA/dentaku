// バージョン定義（更新時はここを変更する：'calc-app-v2' など）
const CACHE_NAME = 'calc-app-v1';

// キャッシュするファイル一覧
// ※アイコン画像やマニフェストもキャッシュします
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png'
];

// インストール処理：キャッシュを開いてファイルを格納
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// アクティベート処理：古いキャッシュを削除（バージョン管理の要）
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 定義したCACHE_NAMEと異なる古いキャッシュがあれば削除
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// フェッチ処理：キャッシュファースト戦略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークに取りに行く
        return fetch(event.request);
      })
  );
});
