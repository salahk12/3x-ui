[English](/README.md) | [فارسی](/README.fa_IR.md)

<div dir="rtl">

# پنل 3X-UI با ظاهر کلاسیک نسخهٔ ۲

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/overview-dark.png">
    <img alt="3X-UI با ظاهر کلاسیک نسخهٔ ۲" src="./media/v2ui/overview-light.png">
  </picture>
</p>

این پروژه یک fork از [MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui) است. **بخش پشتی و همهٔ امکانات نسخهٔ 3.11** را دارد، ولی **ظاهر نسخهٔ 2.9.4** را برمی‌گرداند.

در نسخهٔ ۳، رابط کاربری پنل با React بازنویسی شد. این fork همان کد و همهٔ امکانات نسخهٔ ۳ را نگه می‌دارد و ظاهرش را مثل پنل آشنای نسخهٔ ۲ می‌کند: رنگ‌ها، چیدمان، افکت‌های hover، پنجره‌ها و صفحهٔ سابسکریپشن.

> [!IMPORTANT]
> این پروژه فقط برای استفادهٔ شخصی است. از آن برای کارهای غیرقانونی استفاده نکنید.

## تفاوت با 3x-ui اصلی

بخش پشتی همان نسخهٔ 3.11 اصلی است و پروتکل‌ها، دیتابیس و API تغییری نکرده‌اند. اینباندها، کلاینت‌ها، نودها، API و ربات‌ها دقیقاً مثل نسخهٔ اصلی کار می‌کنند. تغییرات این‌هاست:

**ظاهر (مثل 2.9.4)**

- رنگ سبزآبی نسخهٔ ۲، کارت‌های گرد و فونت وزیرمتن، در تم روشن، تیره و خیلی تیره
- داشبورد کلاسیک با گیج‌های CPU، RAM، Swap و دیسک، و کارت‌های Xray، مدیریت، Uptime، بار سیستم، مصرف، سرعت، حجم کل، IP و اتصال‌ها
- منوی کناری نسخهٔ ۲: ۲۰۰ پیکسلی و جمع‌شو، با انتخاب تم در بالای آن
- صفحهٔ ورود نسخهٔ ۲ با موج‌های متحرک و منوی تنظیمات تم و زبان
- جدول اینباندها: ستون‌های نسخهٔ ۲، یک منوی «⋮» برای عملیات، شمارندهٔ کلاینت‌ها، و سرستون‌هایی که مرتب‌سازی ندارند
- صفحه‌های تنظیمات و Xray: تب‌ها در بالا، بخش‌های بازوبسته‌شو، و دکمهٔ **Restart Xray** کنار Save
- صفحهٔ سابسکریپشن نسخهٔ ۲: QR در قاب چرخان، جزئیات مصرف، لینک‌ها و منوی برنامه‌های اندروید و iOS
- پنجره‌ها، پیام‌ها، منوهای کشویی، گزینه‌های انتخاب، حاشیهٔ فیلدهای فعال، برچسب‌های چندانتخابی، دکمه‌های فیلد عددی و تگ‌ها مثل نسخهٔ ۲
- افکت‌های hover و جابه‌جایی متحرک بین تب‌ها مثل نسخهٔ ۲

**سرعت**

- پنجره‌هایی مثل *Add Inbound* و *Add Client* بلافاصله باز می‌شوند. کدشان در پس‌زمینه بارگذاری می‌شود و تب‌های پنهان بعد از نمایش پنجره ساخته می‌شوند.

**به‌روزرسانی از همین fork**

- `install.sh`، `update.sh`، منوی `x-ui` و دکمهٔ **Update Panel** داخل پنل، نسخه‌ها را از همین مخزن نصب می‌کنند. با به‌روزرسانی، پنل با 3x-ui اصلی جایگزین نمی‌شود.

## نصب

</div>

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh)
```

<div dir="rtl">

اسکریپت نصب یک نام کاربری، رمز و مسیر دسترسی تصادفی می‌سازد. بعد از نصب، با دستور `x-ui` منوی مدیریت باز می‌شود. از آنجا می‌توانید سرویس را روشن و خاموش کنید، اطلاعات ورود را ببینید یا عوض کنید، گواهی SSL بگیرید و کارهای دیگر انجام دهید.

برای نصب یک نسخهٔ مشخص، تگ آن را اضافه کنید:

</div>

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh) v3.11.0
```

<div dir="rtl">

برای نصب نسخهٔ در حال توسعه که از هر commit روی شاخهٔ `v2-ui` ساخته می‌شود و نسخهٔ پایدار نیست:

</div>

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh) dev-latest
```

<div dir="rtl">

کنار هر فایل نسخه یک فایل `.sha256` منتشر می‌شود. اسکریپت نصب و به‌روزرسانی فایل را با آن مقایسه می‌کنند و اگر یکی نباشد، کار را متوقف می‌کنند.

### تبدیل سرور 3x-ui نسخهٔ ۳ موجود به این fork

اینباندها، کلاینت‌ها و تنظیمات شما در `/etc/x-ui` می‌مانند و فقط فایل پنل و اسکریپت‌ها عوض می‌شوند. اول از دیتابیس پشتیبان بگیرید:

</div>

```bash
cp -a /etc/x-ui /etc/x-ui.backup
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/update.sh)
```

<div dir="rtl">

برای برگشت به نسخهٔ اصلی، `update.sh` پروژهٔ اصلی را اجرا کنید. ساختار دیتابیس یکی است.

### نصب بدون سؤال

با `XUI_NONINTERACTIVE=1`، یا اجرای اسکریپت بدون ترمینال، نصب بدون هیچ سؤالی انجام می‌شود و اطلاعات ورود در `/etc/x-ui/install-result.env` ذخیره می‌شود. نمونهٔ cloud-init در پوشهٔ [`deploy/`](deploy/) است.

### نصب از مخزن یا شاخهٔ دیگر

اسکریپت‌ها متغیرهای `XUI_REPO` (پیش‌فرض `salahk12/3x-ui`) و `XUI_BRANCH` (پیش‌فرض `v2-ui`) را می‌خوانند. با آن‌ها می‌توانید نصب را از یک mirror یا fork خودتان انجام دهید.

## سیستم‌عامل‌ها و معماری‌ها

**سیستم‌عامل:** Ubuntu، Debian، Armbian، Fedora، CentOS، RHEL، AlmaLinux، Rocky Linux، Oracle Linux، Amazon Linux، Virtuozzo، Arch، Manjaro، Parch، openSUSE، Alpine و Windows

**معماری:** `amd64` · `386` · `arm64` · `armv7` · `armv6` · `armv5` · `s390x`

## دیتابیس

هنگام نصب می‌توانید یکی از این دو را انتخاب کنید:

- **SQLite** (پیش‌فرض): یک فایل در `/etc/x-ui/x-ui.db`
- **PostgreSQL**: برای تعداد زیاد کلاینت یا چند نود مناسب‌تر است. اسکریپت نصب می‌تواند آن را روی همان سرور نصب کند یا به یک سرور موجود وصل شود.

برای انتقال یک نصب SQLite به PostgreSQL:

</div>

```bash
x-ui migrate-db --dsn "postgres://xui:password@127.0.0.1:5432/xui?sslmode=disable"
systemctl restart x-ui
```

<div dir="rtl">

## ساخت از سورس

به Node.js نسخهٔ ۲۶ یا بالاتر و Go نسخهٔ 1.27 یا بالاتر نیاز دارید.

</div>

```bash
git clone -b v2-ui https://github.com/salahk12/3x-ui.git
cd 3x-ui/frontend && npm ci && npm run build
cd .. && go build -ldflags "-w -s" -o x-ui .
```

<div dir="rtl">

کد رابط کاربری در `frontend/` است. استایل‌های نسخهٔ ۲ در `frontend/src/styles/v2-classic.css` و `frontend/src/hooks/useTheme.tsx` هستند.

## انتشار نسخه‌ها

با push یک تگ `vX.Y.Z`، GitHub Actions برای همهٔ معماری‌ها فایل می‌سازد و یک نسخه منتشر می‌کند. هر push به شاخهٔ `v2-ui` نسخهٔ `dev-latest` را به‌روز می‌کند. شمارهٔ نسخه‌های fork از نسخهٔ اصلی که بر آن بنا شده‌اند شروع می‌شود و اصلاحاتِ مخصوص fork عدد آخر را بالا می‌برند.

## قدردانی

- [MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui) و همهٔ مشارکت‌کنندگانش، برای پنلی که این fork بر پایهٔ آن ساخته شده است
- [alireza0](https://github.com/alireza0/)، برای کار اولیه روی X-UI
- [Iran v2ray rules](https://github.com/chocolate4u/Iran-v2ray-rules) و [Russia v2ray rules](https://github.com/runetfreedom/russia-v2ray-rules-dat)، برای داده‌های مسیریابی همراه پنل

## مجوز

[GPL-3.0](LICENSE)، همان مجوز 3x-ui اصلی

</div>
