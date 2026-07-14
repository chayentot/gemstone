const state={token:sessionStorage.getItem("adminToken")||""};
const $=id=>document.getElementById(id);

function apiUrl(){
  const u=window.APP_CONFIG&&window.APP_CONFIG.API_URL;
  if(!u||u.includes("PASTE_YOUR"))throw new Error("Set the Apps Script URL in config.js.");
  return u;
}
async function api(action,payload={},token=""){
  const r=await fetch(apiUrl(),{
    method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"},
    body:JSON.stringify({action,payload,token})
  });
  const d=await r.json();
  if(!d.ok)throw new Error(d.error||"Request failed");
  return d.data;
}
function showNotice(message,isError=false){
  const n=$("notice");
  n.textContent=message;
  n.className=isError?"notice error":"notice";
  setTimeout(()=>n.classList.add("hidden"),5000);
}

$("adminLoginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  try{
    const d=await api("adminLogin",{
      username:$("adminUsername").value.trim(),
      password:$("adminPassword").value
    });
    state.token=d.token;
    sessionStorage.setItem("adminToken",d.token);
    await loadAdmin();
  }catch(err){showNotice(err.message,true)}
});

$("adminLogoutBtn").addEventListener("click",()=>{
  state.token="";
  sessionStorage.removeItem("adminToken");
  $("adminDashboard").classList.add("hidden");
  $("adminLogin").classList.remove("hidden");
  $("adminLogoutBtn").classList.add("hidden");
});
$("refreshAdminBtn").addEventListener("click",loadAdmin);

async function loadAdmin(){
  const d=await api("adminDashboard",{},state.token);
  $("adminLogin").classList.add("hidden");
  $("adminDashboard").classList.remove("hidden");
  $("adminLogoutBtn").classList.remove("hidden");

  $("totalMembers").textContent=d.stats.totalMembers;
  $("pendingDeposits").textContent=d.stats.pendingDeposits;
  $("pendingWithdrawals").textContent=d.stats.pendingWithdrawals;
  $("activeMemberships").textContent=d.stats.activeMemberships;

  $("pendingDepositsBody").innerHTML=d.pendingDeposits.length
    ?d.pendingDeposits.map(x=>`<tr>
      <td><strong>${esc(x.fullName)}</strong><br><span class="muted">${esc(x.email)}</span></td>
      <td>₱${Number(x.amount).toLocaleString()}</td>
      <td>${esc(x.method)}</td>
      <td>${esc(x.reference)}</td>
      <td>${x.proofUrl?`<a href="${esc(x.proofUrl)}" target="_blank" rel="noopener">Open proof</a>`:"—"}</td>
      <td><button class="secondary small-btn" onclick="decideDeposit('${x.id}','Approved')">Approve</button><button class="secondary small-btn" onclick="decideDeposit('${x.id}','Rejected')">Reject</button></td>
    </tr>`).join("")
    :`<tr><td colspan="6">No pending deposits.</td></tr>`;

  $("pendingWithdrawalsBody").innerHTML=d.pendingWithdrawals.length
    ?d.pendingWithdrawals.map(x=>`<tr>
      <td><strong>${esc(x.fullName)}</strong><br><span class="muted">${esc(x.email)}</span></td>
      <td>${Number(x.points).toLocaleString()}</td>
      <td>${esc(x.method)}</td>
      <td>${esc(x.accountNumber)}</td>
      <td>${esc(x.accountName)}</td>
      <td><button class="secondary small-btn" onclick="decideWithdrawal('${x.id}','Approved')">Approve</button><button class="secondary small-btn" onclick="decideWithdrawal('${x.id}','Rejected')">Reject</button></td>
    </tr>`).join("")
    :`<tr><td colspan="6">No pending withdrawals.</td></tr>`;

  $("membersBody").innerHTML=d.members.map(m=>`<tr>
    <td><strong>${esc(m.fullName)}</strong><br><span class="muted">${esc(m.email)}</span></td>
    <td>₱${Number(m.walletBalance).toLocaleString()}</td>
    <td>${m.activeSubscriptions}</td>
    <td>${Number(m.pointsBalance).toLocaleString()}</td>
    <td>${Number(m.pendingWithdrawalPoints).toLocaleString()}</td>
    <td><input id="perk-${m.id}" value="${esc(m.perkNote||"")}" placeholder="Manual perk note"><button class="secondary small-btn" onclick="savePerk('${m.id}')">Save</button></td>
  </tr>`).join("");
}

window.decideDeposit=async function(id,status){
  try{
    await api("adminDecideDeposit",{depositId:id,status},state.token);
    showNotice(`Deposit ${status.toLowerCase()}.`);
    loadAdmin();
  }catch(err){showNotice(err.message,true)}
};

window.decideWithdrawal=async function(id,status){
  try{
    await api("adminDecideWithdrawal",{withdrawalId:id,status},state.token);
    showNotice(`Withdrawal ${status.toLowerCase()}.`);
    loadAdmin();
  }catch(err){showNotice(err.message,true)}
};

window.savePerk=async function(id){
  try{
    await api("adminSavePerk",{memberId:id,perkNote:$(`perk-${id}`).value.trim()},state.token);
    showNotice("Perk note saved.");
  }catch(err){showNotice(err.message,true)}
};

function esc(value){
  return String(value||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
if(state.token)loadAdmin().catch(()=>{});
