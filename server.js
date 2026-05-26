const http = require("http");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "data.json");
const PORT = process.env.PORT || 3456;

// ---- Data helpers ----
function loadData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch (_) { return null; }
}
function saveData(data) { fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8"); }

function initData() {
  if (loadData()) return;
  const tasks = {
    "采购员": ["完成当日采购订单","供应商比价记录","采购品质量验收","采购清单录入系统"],
    "分拣员": ["完成当日分拣任务","分拣准确率检查","异常品上报处理","分拣区域清洁整理"],
    "配送司机": ["完成当日配送任务","车辆安全检查记录","客户签收确认无误","回单整理上交"],
    "销售经理": ["客户拜访/回访记录","新客户开发跟进","销售报表填写","客户投诉处理"],
    "库管": ["入库验收登记","出库核对发货","库存盘点核对","温控记录检查"],
    "会计": ["日常账务处理","发票整理归档","报销单据审核","银行对账确认"],
    "下单员": ["客户订单处理完成","订单核对确认","异常订单跟踪处理","客户沟通记录"],
    "主管经理": ["团队早会/夕会主持","现场巡查记录","工作日报审核","异常事件处理"],
    "老板": ["查看团队日报","审批重要事项","客户关系维护","经营数据分析"]
  };
  const employees = [
    { name: "张德福", role: "采购员", pass: "123456", phone: "13800001001" },
    { name: "李明华", role: "采购员", pass: "123456", phone: "13800001002" },
    { name: "王志强", role: "采购员", pass: "123456", phone: "13800001003" },
    { name: "陈小燕", role: "分拣员", pass: "123456", phone: "13800001004" },
    { name: "刘桂芳", role: "分拣员", pass: "123456", phone: "13800001005" },
    { name: "赵大刚", role: "分拣员", pass: "123456", phone: "13800001006" },
    { name: "周秀英", role: "分拣员", pass: "123456", phone: "13800001007" },
    { name: "吴建国", role: "配送司机", pass: "123456", phone: "13800001008" },
    { name: "郑永发", role: "配送司机", pass: "123456", phone: "13800001009" },
    { name: "冯学军", role: "配送司机", pass: "123456", phone: "13800001010" },
    { name: "何大伟", role: "配送司机", pass: "123456", phone: "13800001011" },
    { name: "孙丽华", role: "销售经理", pass: "123456", phone: "13800001012" },
    { name: "马国栋", role: "销售经理", pass: "123456", phone: "13800001013" },
    { name: "黄丽珍", role: "库管", pass: "123456", phone: "13800001014" },
    { name: "林文龙", role: "库管", pass: "123456", phone: "13800001015" },
    { name: "杨美琴", role: "会计", pass: "123456", phone: "13800001016" },
    { name: "徐晓明", role: "会计", pass: "123456", phone: "13800001017" },
    { name: "朱建华", role: "下单员", pass: "123456", phone: "13800001018" },
    { name: "谢晓红", role: "下单员", pass: "123456", phone: "13800001019" },
    { name: "沈志远", role: "下单员", pass: "123456", phone: "13800001020" },
    { name: "韩雪梅", role: "下单员", pass: "123456", phone: "13800001021" },
    { name: "曹永强", role: "主管经理", pass: "123456", phone: "13800001022" },
    { name: "魏玉兰", role: "主管经理", pass: "123456", phone: "13800001023" },
    { name: "周总", role: "老板", pass: "123456", phone: "13800001000" }
  ];
  const completions = {};
  saveData({ tasks, employees, completions });
}

// ---- MIME ----
const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".ico": "image/x-icon" };

function serveStatic(req, res) {
  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(__dirname, "public", filePath);
  if (!filePath.startsWith(path.join(__dirname, "public"))) { res.writeHead(403); res.end(); return true; }
  if (!fs.existsSync(filePath)) return false;
  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

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

// ---- Server ----
initData();

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // Static files
  if (req.method === "GET" && serveStatic(req, res)) return;

  // API routes
  const url = req.url.split("?")[0];

  // GET /api/init - return tasks, employees (no passwords), completions
  if (req.method === "GET" && url === "/api/init") {
    const d = loadData();
    const safeEmps = d.employees.map(e => ({ name: e.name, role: e.role, phone: e.phone }));
    return json(res, { tasks: d.tasks, employees: safeEmps, completions: d.completions });
  }

  // POST /api/login
  if (req.method === "POST" && url === "/api/login") {
    const body = await readBody(req);
    const d = loadData();
    const emp = d.employees.find(e => e.name === body.name && e.pass === body.pass);
    if (!emp) return json(res, { ok: false, msg: "姓名或密码错误" }, 401);
    const idx = d.employees.indexOf(emp);
    return json(res, { ok: true, empId: idx, role: emp.role, name: emp.name, tasks: d.tasks[emp.role] || [] });
  }

  // POST /api/toggle - toggle task completion
  if (req.method === "POST" && url === "/api/toggle") {
    const body = await readBody(req);
    const d = loadData();
    const { empId, date, taskIdx } = body;
    if (!d.completions[empId]) d.completions[empId] = {};
    if (!d.completions[empId][date]) d.completions[empId][date] = {};
    if (d.completions[empId][date][taskIdx]) {
      delete d.completions[empId][date][taskIdx];
    } else {
      d.completions[empId][date][taskIdx] = true;
    }
    saveData(d);
    return json(res, { ok: true, completed: !!d.completions[empId][date][taskIdx] });
  }

  // GET /api/completions?empId=X&date=Y
  if (req.method === "GET" && url === "/api/completions") {
    const d = loadData();
    const q = new URL(req.url, "http://localhost").searchParams;
    const empId = q.get("empId"), date = q.get("date");
    if (empId && date) {
      const c = (d.completions[empId] && d.completions[empId][date]) || {};
      return json(res, c);
    }
    return json(res, d.completions);
  }

  // GET /api/employees (admin - returns with passwords)
  if (req.method === "GET" && url === "/api/employees") {
    const d = loadData();
    return json(res, d.employees);
  }

  // POST /api/employees
  if (req.method === "POST" && url === "/api/employees") {
    const body = await readBody(req);
    const d = loadData();
    d.employees.push({ name: body.name, role: body.role, pass: body.pass || "123456", phone: body.phone || "" });
    saveData(d);
    return json(res, { ok: true });
  }

  // PUT /api/employees/:id
  if (req.method === "PUT" && url.startsWith("/api/employees/")) {
    const id = parseInt(url.split("/").pop());
    const body = await readBody(req);
    const d = loadData();
    if (id >= 0 && id < d.employees.length) {
      d.employees[id] = { name: body.name, role: body.role, pass: body.pass, phone: body.phone || "" };
      saveData(d);
      return json(res, { ok: true });
    }
    return json(res, { ok: false }, 404);
  }

  // DELETE /api/employees/:id
  if (req.method === "DELETE" && url.startsWith("/api/employees/")) {
    const id = parseInt(url.split("/").pop());
    const d = loadData();
    if (id >= 0 && id < d.employees.length) {
      d.employees.splice(id, 1);
      if (d.completions[id]) delete d.completions[id];
      // reindex completions
      const nc = {};
      for (const k in d.completions) { const nk = parseInt(k) > id ? parseInt(k) - 1 : k; nc[nk] = d.completions[k]; }
      d.completions = nc;
      saveData(d);
      return json(res, { ok: true });
    }
    return json(res, { ok: false }, 404);
  }

  // POST /api/reset-passwords
  if (req.method === "POST" && url === "/api/reset-passwords") {
    const d = loadData();
    d.employees.forEach(e => e.pass = "123456");
    saveData(d);
    return json(res, { ok: true });
  }

  res.writeHead(404);
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log("🥬 生鲜配送任务追踪系统");
  console.log("   服务地址: http://localhost:" + PORT);
  console.log("   按 Ctrl+C 停止");
});
