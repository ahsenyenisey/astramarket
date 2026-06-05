#!/bin/bash
# ============================================================
# AstraMarket - Tek komutla tum servisleri baslat
# Kullanim:
#   ./start.sh           -> MySQL + backend + frontend baslat
#   ./start.sh --stop    -> tum servisleri durdur
#   ./start.sh --restart -> hepsini durdur ve yeniden baslat
#   ./start.sh --status  -> servis durumlarini goster
# ============================================================

set -e

# Renkler
KIRMIZI='\033[0;31m'
YESIL='\033[0;32m'
SARI='\033[1;33m'
MOR='\033[0;35m'
NC='\033[0m'

PROJE_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJE_DIR/backend"
FRONTEND_DIR="$PROJE_DIR/frontend"
LOG_DIR="$PROJE_DIR/.logs"
PID_DIR="$PROJE_DIR/.pids"

mkdir -p "$LOG_DIR" "$PID_DIR"

MYSQL_BIN="/opt/homebrew/opt/mysql/bin"
MYSQL_DATA="/opt/homebrew/var/mysql"

# ------------------------------------------------------------
# Yardimci fonksiyonlar
# ------------------------------------------------------------

bilgi()   { echo -e "${MOR}▸${NC} $1"; }
basari()  { echo -e "${YESIL}✓${NC} $1"; }
uyari()   { echo -e "${SARI}!${NC} $1"; }
hata()    { echo -e "${KIRMIZI}✗${NC} $1"; }

port_dolu() {
  lsof -ti :"$1" >/dev/null 2>&1
}

mysql_calisiyor() {
  "$MYSQL_BIN/mysqladmin" -u root ping >/dev/null 2>&1
}

backend_saglikli() {
  curl -fs http://localhost:4000/api/saglik >/dev/null 2>&1
}

frontend_saglikli() {
  curl -fs -o /dev/null http://localhost:5173/ 2>&1
}

# ------------------------------------------------------------
# MySQL
# ------------------------------------------------------------

mysql_baslat() {
  if mysql_calisiyor; then
    basari "MySQL zaten calisiyor (port 3306)"
    return 0
  fi

  bilgi "MySQL baslatiliyor..."
  nohup "$MYSQL_BIN/mysqld" \
    --datadir="$MYSQL_DATA" \
    > "$LOG_DIR/mysql.log" 2>&1 &
  echo $! > "$PID_DIR/mysql.pid"

  # 15 saniyeye kadar hazir olmasini bekle
  for i in {1..15}; do
    if mysql_calisiyor; then
      basari "MySQL hazir (port 3306)"
      return 0
    fi
    sleep 1
  done

  hata "MySQL baslatilamadi. Log: $LOG_DIR/mysql.log"
  return 1
}

mysql_durdur() {
  if mysql_calisiyor; then
    bilgi "MySQL durduruluyor..."
    "$MYSQL_BIN/mysqladmin" -u root shutdown 2>&1 || true
    rm -f "$PID_DIR/mysql.pid"
    basari "MySQL durduruldu"
  else
    uyari "MySQL zaten calismiyor"
  fi
}

# ------------------------------------------------------------
# Backend
# ------------------------------------------------------------

backend_baslat() {
  if backend_saglikli; then
    basari "Backend zaten calisiyor (port 4000)"
    return 0
  fi

  if port_dolu 4000; then
    uyari "Port 4000 baska bir process tarafindan kullaniliyor, durduruluyor..."
    lsof -ti :4000 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi

  if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    bilgi "Backend bagimliliklari yukleniyor..."
    (cd "$BACKEND_DIR" && npm install --silent)
  fi

  if [ ! -f "$BACKEND_DIR/.env" ]; then
    bilgi ".env dosyasi olusturuluyor (.env.example'dan)..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
  fi

  bilgi "Backend baslatiliyor..."
  cd "$BACKEND_DIR"
  nohup node server.js > "$LOG_DIR/backend.log" 2>&1 &
  echo $! > "$PID_DIR/backend.pid"
  cd - >/dev/null

  for i in {1..10}; do
    if backend_saglikli; then
      basari "Backend hazir (http://localhost:4000)"
      return 0
    fi
    sleep 1
  done

  hata "Backend baslatilamadi. Log: $LOG_DIR/backend.log"
  return 1
}

backend_durdur() {
  if [ -f "$PID_DIR/backend.pid" ]; then
    local pid
    pid=$(cat "$PID_DIR/backend.pid")
    kill "$pid" 2>/dev/null || true
    rm -f "$PID_DIR/backend.pid"
  fi
  if port_dolu 4000; then
    lsof -ti :4000 | xargs kill -9 2>/dev/null || true
  fi
  basari "Backend durduruldu"
}

# ------------------------------------------------------------
# Frontend
# ------------------------------------------------------------

frontend_baslat() {
  if port_dolu 5173 && frontend_saglikli; then
    basari "Frontend zaten calisiyor (port 5173)"
    return 0
  fi

  if port_dolu 5173; then
    uyari "Port 5173 baska bir process tarafindan kullaniliyor, durduruluyor..."
    lsof -ti :5173 | xargs kill -9 2>/dev/null || true
    sleep 1
  fi

  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    bilgi "Frontend bagimliliklari yukleniyor (birkac dakika surebilir)..."
    (cd "$FRONTEND_DIR" && npm install --silent)
  fi

  bilgi "Frontend (Vite) baslatiliyor..."
  cd "$FRONTEND_DIR"
  nohup npx vite > "$LOG_DIR/frontend.log" 2>&1 &
  echo $! > "$PID_DIR/frontend.pid"
  cd - >/dev/null

  for i in {1..15}; do
    if frontend_saglikli; then
      basari "Frontend hazir (http://localhost:5173)"
      return 0
    fi
    sleep 1
  done

  hata "Frontend baslatilamadi. Log: $LOG_DIR/frontend.log"
  return 1
}

frontend_durdur() {
  if [ -f "$PID_DIR/frontend.pid" ]; then
    local pid
    pid=$(cat "$PID_DIR/frontend.pid")
    kill "$pid" 2>/dev/null || true
    rm -f "$PID_DIR/frontend.pid"
  fi
  if port_dolu 5173; then
    lsof -ti :5173 | xargs kill -9 2>/dev/null || true
  fi
  basari "Frontend durduruldu"
}

# ------------------------------------------------------------
# Durum
# ------------------------------------------------------------

durum_goster() {
  echo ""
  echo "═══════════════════════════════════════════"
  echo "         ASTRAMARKET SERVIS DURUMU"
  echo "═══════════════════════════════════════════"
  if mysql_calisiyor;    then basari "MySQL    -> localhost:3306"; else hata "MySQL    -> KAPALI"; fi
  if backend_saglikli;   then basari "Backend  -> http://localhost:4000"; else hata "Backend  -> KAPALI"; fi
  if frontend_saglikli;  then basari "Frontend -> http://localhost:5173"; else hata "Frontend -> KAPALI"; fi
  echo "═══════════════════════════════════════════"
  echo ""
}

# ------------------------------------------------------------
# Komut secimi
# ------------------------------------------------------------

case "${1:-}" in
  --stop)
    frontend_durdur
    backend_durdur
    mysql_durdur
    durum_goster
    ;;

  --restart)
    frontend_durdur
    backend_durdur
    mysql_durdur
    sleep 2
    mysql_baslat
    backend_baslat
    frontend_baslat
    durum_goster
    ;;

  --status)
    durum_goster
    ;;

  *)
    echo ""
    echo "🚀 AstraMarket baslatiliyor..."
    echo ""
    mysql_baslat
    backend_baslat
    frontend_baslat
    durum_goster
    echo "Tarayicinizda: http://localhost:5173"
    echo "Loglar:        $LOG_DIR/"
    echo "Durdurmak icin: ./start.sh --stop"
    echo ""
    ;;
esac
