สิ่งที่เปลี่ยนแปลง

โครงสร้างไฟล์ใหม่

app/
types.ts                  ← shared types (Tab, TodoItem)
lib/deadline.ts           ← pure utility: formatDeadline
hooks/useTodos.ts         ← state logic ทั้งหมด
components/
TabBar.tsx              ← tab navigation
AddTodoForm.tsx         ← form สำหรับเพิ่ม task
TodoListItem.tsx        ← แต่ละแถว todo
TodoList.tsx            ← list + empty state
TodoFooter.tsx          ← done count + clear
TodoApp.tsx             ← orchestrator (얇าง มาก)

SOLID Principles

┌───────────────────────────┬──────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
│         Principle         │                       ปัญหาเดิม                        │                                          แก้ไข                                           │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ S – Single Responsibility │ ไฟล์เดียวทำทุกอย่าง (types, state, utils, 4 UI sections) │ แยกแต่ละความรับผิดชอบออกเป็นไฟล์ของตัวเอง                                                     │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ O – Open/Closed           │ เพิ่ม tab ใหม่ต้องแก้ logic ใน component                  │ TAB_CONFIGS array ใน TabBar.tsx — เพิ่ม tab = เพิ่ม entry เดียว                              │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ I – Interface Segregation │ ไม่มี interface ที่ชัดเจน prop ปะปนกัน                     │ แต่ละ component รับเฉพาะ props ที่ตัวเองต้องการ (TodoFooterProps, AddTodoFormProps, ฯลฯ)      │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ D – Dependency Inversion  │ Component ผูกกับ useState โดยตรง                       │ useTodos hook ทำ abstraction — component ขึ้นต่อ interface TodoActions ไม่ใช่ implementation │
└───────────────────────────┴──────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

Code Smells ที่แก้

- God Component: TodoApp.tsx เดิม 250 บรรทัด → เหลือ 30 บรรทัด
- Mixed abstraction levels: logic, utility functions, UI อยู่ปะปนกัน → แยกชั้นชัดเจน
- Hard-coded sample data in component: ย้ายไปอยู่ใน hook พร้อม helper offsetDaysISO/todayISO
  TodoList.tsx            ← list + empty state
  TodoFooter.tsx          ← done count + clear
  TodoApp.tsx             ← orchestrator (얇าง มาก)
  TodoListItem.tsx        ← แต่ละแถว todo
  TodoList.tsx            ← list + empty state
  TodoFooter.tsx          ← done count + clear
  TodoListItem.tsx        ← แต่ละแถว todo
  TodoList.tsx            ← list + empty state
  TodoFooter.tsx          ← done count + clear
  TodoListItem.tsx        ← แต่ละแถว todo
  TodoList.tsx            ← list + empty state
  TodoFooter.tsx          ← done count + clear
  TodoApp.tsx             ← orchestrator (얇าง มาก)

SOLID Principles

┌───────────────────────────┬──────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────┐
│         Principle         │                       ปัญหาเดิม                        │                                          แก้ไข                                           │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ S – Single Responsibility │ ไฟล์เดียวทำทุกอย่าง (types, state, utils, 4 UI sections) │ แยกแต่ละความรับผิดชอบออกเป็นไฟล์ของตัวเอง                                                     │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ O – Open/Closed           │ เพิ่ม tab ใหม่ต้องแก้ logic ใน component                  │ TAB_CONFIGS array ใน TabBar.tsx — เพิ่ม tab = เพิ่ม entry เดียว                              │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ I – Interface Segregation │ ไม่มี interface ที่ชัดเจน prop ปะปนกัน                     │ แต่ละ component รับเฉพาะ props ที่ตัวเองต้องการ (TodoFooterProps, AddTodoFormProps, ฯลฯ)      │
├───────────────────────────┼──────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────┤
│ D – Dependency Inversion  │ Component ผูกกับ useState โดยตรง                       │ useTodos hook ทำ abstraction — component ขึ้นต่อ interface TodoActions ไม่ใช่ implementation │
└───────────────────────────┴──────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────┘

Code Smells ที่แก้

- God Component: TodoApp.tsx เดิม 250 บรรทัด → เหลือ 30 บรรทัด
- Mixed abstraction levels: logic, utility functions, UI อยู่ปะปนกัน → แยกชั้นชัดเจน
- Hard-coded sample data in component: ย้ายไปอยู่ใน hook พร้อม helper offsetDaysISO/todayISO
- Inline ternary chains สำหรับ class: extract เป็นตัวแปรชื่อสื่อความหมาย (deadlineColor, activeClass)
- TabButton ซ่อนอยู่ท้ายไฟล์: ย้ายเข้า TabBar.tsx ที่มันเกี่ยวข้อง

Mobile Responsiveness

- Add form: stacks เป็น column บนมือถือ (flex-col sm:flex-row), date input ขยายเต็มแถว
- ปุ่ม delete: บนมือถือ (sm: breakpoint ลงมา) ปุ่มมองเห็นตลอด ไม่ต้อง hover — เพราะ touch screen ไม่มี hover
- Tap targets: checkbox ใหญ่ขึ้นบนมือถือ (w-6 h-6 sm:w-5 sm:h-5), tab buttons มี min-h-[48px]
- Top padding: pt-8 sm:pt-16 แทน pt-16 คงที่ — ให้ content เริ่มใกล้ขึ้นบนจอเล็ก