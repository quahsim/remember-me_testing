// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정
const firebaseConfig = {
    //개인 파이어베이스 설정정보
    apiKey: "AIzaSyDGqNFb1A7qEsjSZE5LqBakJU7zUY6CZqA",
    authDomain: "sparta-f51b1.firebaseapp.com",
    projectId: "sparta-f51b1",
    storageBucket: "sparta-f51b1.appspot.com",
    messagingSenderId: "1086559326592",
    appId: "1:1086559326592:web:ec9a2d49defa4cc9963165",
    measurementId: "G-VV09XLBM53"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

    // 방명록 저장 버튼 클릭 이벤트
    $("#postinbtn").click(async function () {
        let email = $("#email").val();
        let password = $("#password").val();
        let content = $("#content").val();

        let doc = {
            email: email,
            password: password,
            content: content,
        };
        await addDoc(collection(db, "rememberme"), doc);
        alert("저장 완료");
        window.location.reload();
    });

// 방명록 목록 불러오기
async function loadDocs() {
    let docs = await getDocs(collection(db, "rememberme"));
    docs.forEach((doc) => {
        let row = doc.data();
        let email = row.email;
        let content = row.content;

        let temp_html = `<div class="card-entry">
                            <h5 class="card-title">작성자 : ${email}</h5>
                            <p class="card-text">내용 : ${content}</p>
                        </div>`;
        $(".postingcard").append(temp_html);
    });
}

loadDocs();

// 리셋 버튼 클릭 이벤트
$("#resetbtn").click(function () {
    $("#email").val('');
    $("#password").val('');
    $("#content").val('');
});