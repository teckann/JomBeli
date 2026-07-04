
export default async function FinancialDailyReport({ searchParams }){
    const params = await searchParams;
    const month = params.month || String(new Date().getMonth() + 1).padStart(2, "0");
    const year = params.year || new Date().getFullYear();

    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return(
        <div>
            <h1>Financial Report - Daily</h1>
            <MonthSelector currentMonth={month} currentYear={year} />

            <table>
                <thead>
                    <tr>
                        <th>
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {days.map((day)=>(
                        <DailyReportRow key={day} day={day} month={month} year={year} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}