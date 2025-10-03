# Digital Marketplace App 🛒

אפליקציית Marketplace לפריטים דיגיטליים - מקום לקנות ולמכור כרטיסים, קופונים, ווצ'רים ופריטים דיגיטליים אחרים.

## 🏗️ ארכיטקטורה

- **Frontend**: React Native + TypeScript
- **Backend**: ASP.NET 8 (בפיתוח)
- **Database**: MongoDB Atlas
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Library**: React Native Paper

## 📱 תכונות עיקריות

### למוכרים:
- רישום והתחברות למערכת
- העלאת פריטים דיגיטליים למכירה
- ניהול הצעות מחיר מקונים
- מעקב אחר מכירות

### לקונים:
- עיון בלוח המכירות הראשי
- חיפוש וסינון פריטים
- קנייה מיידית במחיר המבוקש
- הגשת הצעות מחיר חלופיות

## 🚀 התקנה והרצה

### דרישות מקדימות:
- Node.js (גרסה 18+)
- React Native CLI
- Android Studio / Xcode
- .NET 8 SDK (לbackend)

### הרצת הפרויקט:

#### Frontend (React Native):
```bash
cd frontend/DigitalMarketplaceApp
npm install
npx react-native run-android  # לAndroid
npx react-native run-ios      # לiOS
```

#### Backend (ASP.NET):
```bash
cd backend
dotnet restore
dotnet run
```

## 📁 מבנה הפרויקט

```
shayandor/
├── frontend/
│   └── DigitalMarketplaceApp/
│       ├── src/
│       │   ├── components/     # רכיבי UI לשימוש חוזר
│       │   ├── screens/        # מסכי האפליקציה
│       │   ├── services/       # שירותי API וחיבור לשרת
│       │   ├── store/          # Redux store וstate management
│       │   ├── types/          # הגדרות TypeScript
│       │   └── utils/          # פונקציות עזר
│       └── package.json
├── backend/                    # ASP.NET API (בפיתוח)
└── README.md
```

## 🎨 עיצוב ו-UX

האפליקציה מעוצבת עם דגש על:
- ממשק נקי ומודרני
- ניווט אינטואיטיבי
- תגובה מהירה לפעולות המשתמש
- תמיכה מלאה בנגישות
- עיצוב רספונסיבי לכל גדלי המסכים

## 🔧 סטטוס פיתוח

- [x] הקמת סביבת הפיתוח
- [x] יצירת מבנה הפרויקט
- [x] התקנת ספריות בסיס
- [ ] הקמת Backend ASP.NET
- [ ] מימוש מסכי רישום והתחברות
- [ ] מימוש לוח המכירות הראשי
- [ ] מימוש העלאת פריטים
- [ ] מימוש מערכת הצעות מחיר
- [ ] בדיקות ואופטימיזציה

## 🚀 שלבים הבאים

1. **השלמת התקנת .NET SDK**
2. **יצירת Backend API**
3. **חיבור לMongoDB Atlas**
4. **מימוש מסכי האפליקציה**
5. **בדיקות ופריסה**

## 📞 תמיכה

לשאלות או בעיות, פנו אלינו דרך GitHub Issues.

---

**נבנה עם ❤️ בישראל**