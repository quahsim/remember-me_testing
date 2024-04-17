// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 구성 정보 설정   
const firebaseConfig = {
    //개인 파이어베이스 설정정보 심규아로 수정
    apiKey: "AIzaSyCNlqEQIGm9ofoSst6SRhgOYB1j_2XhP2o",
    authDomain: "rememberme-d05ca.firebaseapp.com",
    projectId: "rememberme-d05ca",
    storageBucket: "rememberme-d05ca.appspot.com",
    messagingSenderId: "344171655552",
    appId: "1:344171655552:web:ea7aeaaf8fef2b9c9e9165",
    measurementId: "G-P3TZ5EQVKJ"
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
        let docId = doc.id; // 문서 ID 가져오기

        let temp_html = `<div class="card-entry">
                            <h5 class="card-title">작성자 : ${email}</h5>
                            <p class="card-text">내용 : ${content}</p>
                            <button class="delete-btn" data-doc-id="${docId}">삭제</button> <!-- 삭제 버튼 추가 -->
                            <button class="edit-btn btn btn-warning" data-doc-id="${docId}" data-bs-toggle="modal" data-bs-target="#editModal">수정</button> <!-- 수정 버튼 추가 -->
                        </div>`;
        $(".postingcard").append(temp_html);
    });

    // 삭제 버튼 클릭 이벤트
    $(".delete-btn").click(function () {
        // 클릭된 삭제 버튼의 문서 ID 가져오기
        const docId = $(this).data('doc-id');

        // 비밀번호 입력 모달 보이기
        $("#passwordModal").modal('show');

        // 확인 버튼 클릭 이벤트
        $("#confirmPasswordBtn").off('click').on('click', async function () {
            // 입력된 비밀번호 가져오기
            const password = $("#passwordInput").val();

            try {
                // 해당 문서의 데이터 가져오기
                const docSnapshot = await getDoc(doc(db, "rememberme", docId));
                const data = docSnapshot.data();

                // 입력된 비밀번호와 문서의 비밀번호 확인
                if (password !== data.password) {
                    alert("비밀번호가 일치하지 않습니다.");
                    return;
                }

                // 비밀번호 입력 모달 닫기
                $("#passwordModal").modal('hide');

                // 해당 문서 삭제
                await deleteDoc(doc(db, "rememberme", docId));
                // 삭제되면 화면에서 제거
                $(`.delete-btn[data-doc-id="${docId}"]`).closest('.card-entry').remove();

                alert("삭제 완료");
            } catch (error) {
                console.error("삭제 오류", error);
            }
        });
    });



    // 수정 버튼 클릭 이벤트 (동적 추가)
    $(".edit-btn").click(async function () {
        // 클릭된 수정 버튼의 문서 ID 가져오기
        const docId = $(this).data('doc-id');

        try {
            // 비밀번호 입력 모달 보이기
            $("#passwordModal").modal('show');

            // 확인 버튼 클릭 이벤트
            $("#confirmPasswordBtn").off().click(async function () {
                // 입력된 비밀번호 가져오기
                const password = $("#passwordInput").val();

                try {
                    // 해당 문서의 데이터 가져오기
                    const docSnapshot = await getDoc(doc(db, "rememberme", docId));
                    const data = docSnapshot.data();

                    // 입력된 비밀번호와 문서의 비밀번호 확인
                    if (password !== data.password) {
                        alert("비밀번호가 일치하지 않습니다.");
                        return;
                    }

                    // 비밀번호 입력 모달 닫기
                    $("#passwordModal").modal('hide');

                    // 수정 모달 보이기
                    $("#editModal").modal('show');

                    // 수정 완료 버튼 클릭 이벤트
                    $("#confirmEditBtn").off().click(async function () {
                        // 수정된 내용 가져오기
                        const editedContent = $("#editContent").val();

                        // 내용이 비어있는지 확인
                        if (!editedContent.trim()) {
                            alert("내용을 입력해주세요.");
                            return;
                        }

                        try {
                            // 해당 문서 업데이트
                            await updateDoc(doc(db, "rememberme", docId), {
                                content: editedContent
                            });

                            // 화면 업데이트
                            $(`.card-entry[data-doc-id="${docId}"] .card-text`).text(`내용 : ${editedContent}`);

                            // 수정 모달 닫기
                            $("#editModal").modal('hide');
                            alert("수정 완료");
                        } catch (error) {
                            console.error("수정 오류", error);
                        }
                    });
                } catch (error) {
                    console.error("비밀번호 확인 오류", error);
                }
            });
        } catch (error) {
            console.error("수정 오류", error);
        }
    });

}

loadDocs();

// 리셋 버튼 클릭 이벤트
$("#resetbtn").click(function () {
    $("#email").val('');
    $("#password").val('');
    $("#content").val('');
});

// 확인 버튼 클릭 이벤트
$("#confirmDeleteBtn").click(async function () {
    const docId = $(this).data('doc-id');
    try {
        await deleteDoc(doc(db, "rememberme", docId));
        $(`.delete-btn[data-doc-id="${docId}"]`).closest('.card-entry').remove(); // 삭제된 항목 화면에서 제거
        $("#deleteModal").modal('hide'); // 모달 닫기
        alert("방명록이 삭제되었습니다.");
    } catch (error) {
        console.error("방명록 삭제 오류", error);
    }
});