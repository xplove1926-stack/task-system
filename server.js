const http = require("http");
const fs = require("fs");
const path = require("path");
const DATA_FILE = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3456;

function loadData() { try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); } catch (_) { return null; } }
function saveData(d) { if(d===null){try{fs.unlinkSync(DATA_FILE)}catch(_){}} else {fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2), "utf8");} }

function initData() { var d=loadData(); if(!d||!d._v||d._v!==2){ try{fs.unlinkSync(DATA_FILE)}catch(_){} d=null; } if(loadData()) return;
  const tasks = {
    "老板": ["查看团队日报","审批重要事项","客户关系维护","经营数据分析"],
    "总负责人": ["团队统筹协调","重大事项决策","部门绩效审核","对外联络对接"],
    "财务经理": ["成本费用核算与监控","税务管理","资金管理","经营分析","账务处理","外部对接","跨部门协助"],
    "财务核算岗": ["采购成本监控","单位成本管控","客户对账","应收账款管理","发票凭证处理"],
    "出纳": ["数据与报表","应付管理","供应商对账","票据凭证管理","跨部门协助"],
    "商务专员": ["人事管理有效性","行政管理","标书协助","合同管理","绩效数据"],
    "客户经理岗": ["客户拜访与维护","订单管理","售后服务","工作报表","跨部门协同"],
    "蔬菜采购": ["询比价与采购计划","供应商开发与管理","到货验收与账务","数据报表与分析","跨部门核对"],
    "预包装采购": ["询比价与采购计划","供应商开发与管理","到货验收与账务","数据报表与分析","跨部门核对"],
    "早班库管": ["收货验收","损耗处理","退换货管理","单据管理","盘点工作"],
    "晚班库管": ["夜班交接","夜间到货验收","系统入库","库存核对","安全管理"],
    "信息岗": ["系统基础数据维护","价格调整执行","订单处理","特殊单据处理","账号权限管理"],
    "分拣": ["分拣准确率","质量把控","复合单确认","现场管理","损耗数据","跨部门协作"],
    "分拣主管": ["人员管理","质量监控","损耗控制","现场管理","盘点工作","跨部门协调"],
    "司机": ["分拣品质检查","安全合规","准时送达率","客户满意度","确认复核单","跨部门协作"],
    "配送主管": ["准时与效率","服务质量","客户满意度","财务数据对接","库房协调","配送调度"],
    "标书专员": ["标前信息收集与预判","投标资料准备与更新","标书编制与审核","合规与风险管控","项目中标跟进"]
  };

  const kpiWeights = {
    "老板": {},
    "总负责人": {},
    "财务经理": {"成本费用核算与监控":30,"税务管理":15,"资金管理":10,"经营分析":20,"账务处理":15,"外部对接":5,"跨部门协助":5},
    "财务核算岗": {"采购成本监控":30,"单位成本管控":15,"客户对账":40,"应收账款管理":10,"发票凭证处理":5},
    "出纳": {"数据与报表":20,"应付管理":40,"供应商对账":30,"票据凭证管理":5,"跨部门协助":5},
    "商务专员": {"人事管理有效性":10,"行政管理":15,"标书协助":30,"合同管理":15,"绩效数据":30},
    "客户经理岗": {"客户拜访与维护":30,"订单管理":20,"售后服务":35,"工作报表":10,"跨部门协同":5},
    "蔬菜采购": {"询比价与采购计划":40,"供应商开发与管理":30,"到货验收与账务":15,"数据报表与分析":10,"跨部门核对":5},
    "预包装采购": {"询比价与采购计划":40,"供应商开发与管理":30,"到货验收与账务":15,"数据报表与分析":10,"跨部门核对":5},
    "早班库管": {"收货验收":30,"损耗处理":20,"退换货管理":20,"单据管理":10,"盘点工作":20},
    "晚班库管": {"夜班交接":10,"夜间到货验收":20,"系统入库":30,"库存核对":20,"安全管理":20},
    "信息岗": {"系统基础数据维护":25,"价格调整执行":50,"订单处理":10,"特殊单据处理":5,"账号权限管理":10},
    "分拣": {"分拣准确率":30,"质量把控":30,"复合单确认":20,"现场管理":10,"损耗数据":5,"跨部门协作":5},
    "分拣主管": {"人员管理":10,"质量监控":30,"损耗控制":30,"现场管理":10,"盘点工作":10,"跨部门协调":10},
    "司机": {"分拣品质检查":15,"安全合规":10,"准时送达率":10,"客户满意度":30,"确认复核单":25,"跨部门协作":10},
    "配送主管": {"准时与效率":30,"服务质量":30,"客户满意度":20,"财务数据对接":10,"库房协调":10},
    "标书专员": {"标前信息收集与预判":20,"投标资料准备与更新":15,"标书编制与审核":50,"合规与风险管控":15,"项目中标跟进":10}
  };

  const employees = [
    { name: "邬悦桐", role: "老板", pass: "123456", phone: "" },
    { name: "郭菲", role: "总负责人", pass: "123456", phone: "" },
    { name: "张丽霞", role: "财务经理", pass: "123456", phone: "" },
    { name: "王霞", role: "财务核算岗", pass: "123456", phone: "" },
    { name: "张娟", role: "财务核算岗", pass: "123456", phone: "" },
    { name: "李学英", role: "出纳", pass: "123456", phone: "" },
    { name: "张磊", role: "商务专员", pass: "123456", phone: "" },
    { name: "赵洪利", role: "客户经理岗", pass: "123456", phone: "" },
    { name: "路林龙", role: "蔬菜采购", pass: "123456", phone: "" },
    { name: "刘海文", role: "预包装采购", pass: "123456", phone: "" },
    { name: "李显礼", role: "预包装采购", pass: "123456", phone: "" },
    { name: "王乐", role: "早班库管", pass: "123456", phone: "" },
    { name: "蒋晟", role: "晚班库管", pass: "123456", phone: "" },
    { name: "魏毓辰", role: "信息岗", pass: "123456", phone: "" },
    { name: "张莉莉", role: "信息岗", pass: "123456", phone: "" },
    { name: "徐鹏", role: "标书专员", pass: "123456", phone: "" },
    { name: "徐元", role: "配送主管", pass: "123456", phone: "" },{ name: "张世举", role: "司机", pass: "123456", phone: "" },{ name: "周青霞", role: "分拣主管", pass: "123456", phone: "" },{ name: "张莹", role: "分拣", pass: "123456", phone: "" }
  ];

  saveData({ _v:2, tasks, kpiWeights, employees, completions: {} });
}


const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png" };

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => { try { resolve(JSON.parse(body)); } catch (_) { resolve({}); } });
  });
}
function json(res, data, code = 200) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

initData();

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  const url = req.url.split("?")[0];

  if (req.method === "GET" && (url === "/" || url === "/index.html")) {
    const fp = path.join(__dirname, "index.html");
    if (fs.existsSync(fp)) { res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); fs.createReadStream(fp).pipe(res); return; }
  }

  if (req.method === "GET" && url === "/api/init") {
    const d = loadData();
    const se = d.employees.map(e => ({ name: e.name, role: e.role, phone: e.phone }));
    return json(res, { tasks: d.tasks, kpiWeights: d.kpiWeights, employees: se, completions: d.completions });
  }

  if (req.method === "POST" && url === "/api/login") {
    const body = await readBody(req);
    const d = loadData();
    const emp = d.employees.find(e => e.name === body.name && e.pass === body.pass);
    if (!emp) return json(res, { ok: false, msg: "姓名或密码错误" }, 401);
    const idx = d.employees.indexOf(emp);
    return json(res, { ok: true, empId: idx, role: emp.role, name: emp.name, tasks: d.tasks[emp.role] || [], weights: d.kpiWeights[emp.role] || {} });
  }

  if (req.method === "POST" && url === "/api/change-pass") {
    const body = await readBody(req);
    const d = loadData();
    const emp = d.employees[body.empId];
    if (!emp || emp.pass !== body.oldPass) return json(res, { ok: false, msg: "原密码错误" }, 400);
    emp.pass = body.newPass; saveData(d);
    return json(res, { ok: true });
  }

  if (req.method === "POST" && url === "/api/toggle") {
    const body = await readBody(req);
    const d = loadData();
    const { empId, date, taskIdx } = body;
    if (!d.completions[empId]) d.completions[empId] = {};
    if (!d.completions[empId][date]) d.completions[empId][date] = {};
    if (d.completions[empId][date][taskIdx]) { delete d.completions[empId][date][taskIdx]; }
    else { d.completions[empId][date][taskIdx] = true; }
    saveData(d);
    return json(res, { ok: true, completed: !!d.completions[empId][date][taskIdx] });
  }

  if (req.method === "GET" && url === "/api/completions") {
    const d = loadData();
    const q = new URL(req.url, "http://localhost").searchParams;
    const empId = q.get("empId"), date = q.get("date");
    if (empId && date) return json(res, (d.completions[empId] && d.completions[empId][date]) || {});
    return json(res, d.completions);
  }

  if (req.method === "GET" && url === "/api/employees") { return json(res, loadData().employees); }
  if (req.method === "POST" && url === "/api/employees") {
    const body = await readBody(req); const d = loadData();
    d.employees.push({ name: body.name, role: body.role, pass: body.pass || "123456", phone: body.phone || "" });
    saveData(d); return json(res, { ok: true });
  }
  if (req.method === "PUT" && url.startsWith("/api/employees/")) {
    const id = parseInt(url.split("/").pop()); const body = await readBody(req); const d = loadData();
    if (id >= 0 && id < d.employees.length) {
      d.employees[id] = { name: body.name, role: body.role, pass: body.pass, phone: body.phone || "" };
      saveData(d); return json(res, { ok: true });
    }
    return json(res, { ok: false }, 404);
  }
  if (req.method === "DELETE" && url.startsWith("/api/employees/")) {
    const id = parseInt(url.split("/").pop()); const d = loadData();
    if (id >= 0 && id < d.employees.length) {
      d.employees.splice(id, 1); if (d.completions[id]) delete d.completions[id];
      const nc = {};
      for (const k in d.completions) { const nk = parseInt(k) > id ? parseInt(k) - 1 : k; nc[nk] = d.completions[k]; }
      d.completions = nc; saveData(d); return json(res, { ok: true });
    }
    return json(res, { ok: false }, 404);
  }
  if (req.method === "POST" && url === "/api/reset-passwords") {
    const d = loadData(); d.employees.forEach(e => e.pass = "123456");
    saveData(d); return json(res, { ok: true });
  }

  if(req.method==="GET"&&url==="/api/reset"){try{fs.unlinkSync(DATA_FILE)}catch(_){}initData();return json(res,{ok:true,msg:"数据已重置，请重新登录"});}res.writeHead(404);res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("公司绩效薪酬统计");
  console.log("服务地址: http://localhost:" + PORT);
});





