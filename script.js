const serviceName = "Honeymoon Plan";
let isSubscribed = false;
let submitCount = 0;

console.log(typeof serviceName);
console.log(typeof isSubscribed);
console.log(typeof submitCount);

function makeSubscribeMessage(email, subscribed) {
    if (subscribed === true) {
        return email + "님, 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해주세요.";
}

const subscribeForm = document.querySelector("#subscribe-form");
const emailInput = document.querySelector("#email");

const subscribeButton = document.querySelector("#subscribeButton");
const subscribeMessage = document.querySelector("#subscribeMessage");

function handleSubscribe(event) {
    event.preventDefault();

    const subscriberEmail = emailInput.value.trim();

    if (subscriberEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeSubscribeMessage(subscriberEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);

const themeButton = document.querySelector("#themeButton");
const nicknameInput = document.querySelector("#nickname");
const nicknameCount = document.querySelector("#nicknameCount");
const agreeCheck = document.querySelector("#agree");
const agreeMessage = document.querySelector("#agreeMessage");
const startButton = document.querySelector("#startButton");

function handleThemeClick(event) {
  const isDark = document.body.classList.toggle("dark");

  themeButton.textContent = isDark ? "라이트 테마로 바꾸기" : "다크 테마로 바꾸기";
}

themeButton.addEventListener("click", handleThemeClick);

function handleNicknameInput(event) {
   const maxLength = nicknameInput.maxLength;
   const currentLength = Math.min(nicknameInput.value.length, maxLength);
   
   nicknameCount.textContent = currentLength + " / " + maxLength;
}
nicknameInput.addEventListener("input", handleNicknameInput);

function handleAgreeChange() {
   const agreed = agreeCheck.checked;

   startButton.disabled = !agreed;
   agreeMessage.textContent = agreed 
    ? "여행준비를 시작할 수 있습니다." 
    : "동의 후 여행준비를 시작할 수 있습니다.";

    if (agreed) {
        agreeMessage.classList.add("is-ready");
    } else{
        agreeMessage.classList.remove("is-ready");
    }
}

agreeCheck.addEventListener("change", handleAgreeChange);

const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

function resetTabsAndPanels(){
    tabs.forEach(function(tab){
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected","false");
    });
    panels.forEach(function(panel){
        panel.classList.remove("is-active")
        panel.hidden = true;
    })
}

function activateTab(clickedTab){
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.getElementById(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected","true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}

function handleTabClick(event){
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}

tabs.forEach(function(tab){
    tab.addEventListener("click", handleTabClick);
})

const trainingFlow= document.querySelector("#training-flow");
const flowSteps = trainingFlow.querySelectorAll(".step");
const progressItems = trainingFlow.querySelectorAll(".progress_item");
const titleInput = document.querySelector("#presentation-title");
const titleError = document.querySelector("#title-error");
const titleNext = document.querySelector("#title-next");
const durationRange = document.querySelector("#duration-range");
const durationValue = document.querySelector("#duration-value");
const qnaOption = document.querySelector("#qna-option");
const qnaOptions = document.querySelector("#qna-options");
const optionPrev = document.querySelector("#option-prev");
const optionNext = document.querySelector("#option-next");
const summaryPrev = document.querySelector("#summary-prev");
const finishButton = document.querySelector("#finish-button");
const restartButton = document.querySelector("#restart-button");
const summaryTitle = document.querySelector("#summary-title");
const summaryDuration = document.querySelector("#summary-duration");
const summaryQna = document.querySelector("#summary-qna")
const durationValues = ["3","5","10"];

const formData = {
    title: "", duration: "5", qna: false, qnaCount: "2"
};

function showStep(index){
    if (index !== 3) {
        completedPlan = null;
        document.querySelector("#save-plan-message").textContent = "";
    }
    flowSteps.forEach((step, i) => {step.hidden = i !== index; })
    progressItems.forEach((item, i) => {
        item.classList.toggle("is-active", i=== index)
    });
}

const recordingDialog = document.querySelector("#recording-dialog");
const recordingCancel = document.querySelector("#recording-cancel");
const recordingConfirm = document.querySelector("#recording-confirm");

function revokeRecordingAgreement(){
    agreeCheck.checked = false;
    trainingFlow.hidden = true;
    handleAgreeChange();
    agreeCheck.focus();
}

startButton.addEventListener("click",() =>{
    if(!agreeCheck.checked)return;
    recordingDialog.showModal();
});

recordingCancel.addEventListener("click", ()=>{
    recordingDialog.close();
    revokeRecordingAgreement();
});
recordingDialog.addEventListener("cancel",revokeRecordingAgreement);
recordingConfirm.addEventListener("click",()=>{
    if(!agreeCheck.checked) return;
    recordingDialog.close();
    agreeMessage.textContent = "여행준비를 시작했습니다.";
    trainingFlow.hidden = false;
    showStep(0);
    trainingFlow.scrollIntoView({behavior: "smooth"});
    titleInput.focus();
})
    
function validateTitle(){
    const value = titleInput.value.trim();
    if (!value){
        titleError.textContent = "여행 제목을 입력해주세요"
        titleInput.classList.add("has-error");
        titleInput.focus();
        return false;
    }
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    formData.title = value;
    return true;
}

titleNext.addEventListener("click", ()=> {
    if(!validateTitle()) return;
    showStep(1);
})

durationRange.addEventListener("input", () =>{
    durationValue.value = durationValues[durationRange.value] + "분";
});
qnaOption.addEventListener("change", () => {
    qnaOptions.hidden = !qnaOption.checked;
});

optionPrev.addEventListener("click", () => showStep(0));
optionNext.addEventListener("click", () => {
    formData.duration = durationValues[durationRange.value];
    formData.qna = qnaOption.checked;
    const count = document.querySelector('input[name=qna-count]:checked');
    formData.qnaCount = count.value;
    summaryTitle.textContent = formData.title;
    summaryDuration.textContent= formData.duration +"분";
    summaryQna.textContent = formData.qna ? formData.qnaCount + "개 포함" : "미포함";
    showStep(2);
});

summaryPrev.addEventListener("click", () => showStep(1));
finishButton.addEventListener("click", () => {
    // 복사본을 만들어 이후 입력을 바꿔도 완료한 결과가 바뀌지 않게 합니다.
    completedPlan = { ...formData };
    document.querySelector("#save-plan-message").textContent = "완료한 계획을 목록에 저장할 수 있습니다.";
    showStep(3);
});
restartButton.addEventListener("click", () =>{
    formData.title = "";
    formData.duration = "5";
    formData.qna = false;
    formData.qnaCount = "2";
    titleInput.value = "";
    titleError.textContent = "";
    titleInput.classList.remove("has-error");
    durationRange.value = "1";
    durationValue.value = "5분";
    qnaOption.checked = false;
    qnaOptions.hidden = true;
    document.querySelector('input[name="qna-count"][value="2"]').checked = true;
    summaryTitle.textContent = "";
    summaryDuration.textContent = "";
    summaryQna.textContent= "";
    showStep(0);
});


// 중간고사 추가 기능: 완료한 여행 준비 계획을 목록에 저장하고 다시 열기
let completedPlan = null;
let savedPlans = [];
let nextPlanId = 1;
let openedPlanId = null;
let pendingDeleteId = null;
const savedList = document.querySelector("#saved-plan-list");
const savedDetail = document.querySelector("#saved-plan-detail");
const savedListMessage = document.querySelector("#saved-list-message");
const savePlanMessage = document.querySelector("#save-plan-message");
const deletePlanDialog = document.querySelector("#delete-plan-dialog");

function renderSavedPlans() {
    savedList.replaceChildren();
    document.querySelector("#saved-empty").hidden = savedPlans.length > 0;
    document.querySelector("#saved-count").textContent = "저장한 계획: " + savedPlans.length + "개";

    savedPlans.forEach(function(plan) {
        const item = document.createElement("li");
        item.className = "saved-plan-card";
        const title = document.createElement("h3");
        // 사용자가 적은 제목을 HTML로 해석하지 않고 글자로 표시합니다.
        title.textContent = plan.title;
        const summary = document.createElement("p");
        summary.textContent = "준비 " + plan.duration + "분 · 여행 질문 " +
            (plan.qna ? plan.qnaCount + "개 포함" : "미포함");
        const actions = document.createElement("div");
        actions.className = "saved-plan-actions";
        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "다시 열기";
        openButton.dataset.action = "open";
        openButton.dataset.planId = plan.id;
        openButton.setAttribute("aria-label", plan.title + " 계획 다시 열기");
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-plan-button";
        deleteButton.textContent = "삭제";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.planId = plan.id;
        deleteButton.setAttribute("aria-label", plan.title + " 계획 삭제");
        actions.append(openButton, deleteButton);
        item.append(title, summary, actions);
        savedList.append(item);
    });
}

document.querySelector("#save-plan-button").addEventListener("click", function() {
    if (!completedPlan || !completedPlan.title.trim()) {
        savePlanMessage.textContent = "먼저 여행 준비 설정을 완료해 주세요.";
        return;
    }

    // 이름과 실제 준비 조건이 같으면 같은 계획으로 봅니다.
    // 질문 미포함일 때는 숨겨진 질문 수를 비교하지 않습니다.
    const duplicate = savedPlans.some(function(plan) {
        return plan.title === completedPlan.title &&
            plan.duration === completedPlan.duration &&
            plan.qna === completedPlan.qna &&
            (!plan.qna || plan.qnaCount === completedPlan.qnaCount);
    });
    if (duplicate) {
        savePlanMessage.textContent = "같은 계획이 이미 저장되어 있습니다. 아래 목록에서 다시 열어 확인해 주세요.";
        return;
    }

    savedPlans.push({ ...completedPlan, id: nextPlanId++ });
    renderSavedPlans();
    savePlanMessage.textContent = "계획을 저장했습니다. '저장한 계획 목록 보기'를 눌러 다시 확인할 수 있습니다.";
    savedListMessage.textContent = completedPlan.title + " 계획을 목록에 추가했습니다.";
});

function focusListButton(id, action) {
    const button = savedList.querySelector('[data-action="' + action + '"][data-plan-id="' + id + '"]');
    if (button) button.focus();
    else document.querySelector("#saved-plans-title").focus();
}

savedList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-plan-id]");
    if (!button) return;
    const plan = savedPlans.find(function(item) {
        return item.id === Number(button.dataset.planId);
    });
    if (!plan) {
        savedListMessage.textContent = "계획을 찾을 수 없습니다. 목록에서 다른 계획을 선택해 주세요.";
        return;
    }
    if (button.dataset.action === "open") {
        openedPlanId = plan.id;
        document.querySelector("#saved-detail-name").textContent = plan.title;
        document.querySelector("#saved-detail-duration").textContent = plan.duration + "분";
        document.querySelector("#saved-detail-qna").textContent = plan.qna ? plan.qnaCount + "개 포함" : "미포함";
        savedDetail.hidden = false;
        savedListMessage.textContent = plan.title + " 계획을 다시 열었습니다.";
        document.querySelector("#saved-detail-title").focus();
    } else if (button.dataset.action === "delete") {
        pendingDeleteId = plan.id;
        document.querySelector("#delete-plan-description").textContent =
            "'" + plan.title + "' 계획을 목록에서 삭제할까요? 삭제한 계획은 목록에서 다시 열 수 없습니다.";
        deletePlanDialog.showModal();
    }
});

document.querySelector("#close-saved-detail").addEventListener("click", function() {
    savedDetail.hidden = true;
    focusListButton(openedPlanId, "open");
    openedPlanId = null;
});

function cancelPlanDeletion() {
    const id = pendingDeleteId;
    deletePlanDialog.close();
    pendingDeleteId = null;
    savedListMessage.textContent = "삭제를 취소했습니다. 계획은 목록에 그대로 남아 있습니다.";
    focusListButton(id, "delete");
}
document.querySelector("#delete-plan-cancel").addEventListener("click", cancelPlanDeletion);
deletePlanDialog.addEventListener("cancel", function(event) {
    event.preventDefault();
    cancelPlanDeletion();
});
document.querySelector("#delete-plan-confirm").addEventListener("click", function() {
    const id = pendingDeleteId;
    const plan = savedPlans.find(function(item) { return item.id === id; });
    if (!plan) {
        deletePlanDialog.close();
        pendingDeleteId = null;
        savedListMessage.textContent = "삭제할 계획이 없습니다. 목록을 다시 확인해 주세요.";
        return;
    }
    savedPlans = savedPlans.filter(function(item) { return item.id !== id; });
    if (openedPlanId === id) {
        savedDetail.hidden = true;
        openedPlanId = null;
    }
    deletePlanDialog.close();
    pendingDeleteId = null;
    renderSavedPlans();
    savedListMessage.textContent = plan.title + " 계획을 삭제했습니다." +
        (savedPlans.length === 0 ? " 여행 준비 설정에서 새 계획을 만들어 저장해 주세요." : "");
    document.querySelector("#saved-plans-title").focus();
});
document.querySelector("#saved-plans-title").tabIndex = -1;
renderSavedPlans();
