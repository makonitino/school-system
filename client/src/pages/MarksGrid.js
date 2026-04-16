import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MarksGrid.css";

const MarksGrid = () => {
    const [data, setData] = useState(null);
    const [marksState, setMarksState] = useState({});

    // FETCH DATA
    const fetchData = async () => {
        const res = await axios.get(
            "http://localhost:5000/reports/class-grid?class=10A&subjectId=1&term=Term 1"
        );

        setData(res.data);

        // INIT STATE (IMPORTANT FIX)
        const initial = {};

        res.data.students.forEach(student => {
            student.assessments.forEach(assessment => {
                assessment.tasks.forEach(task => {
                    initial[`${student.studentId}-${task.taskId}`] =
                        task.marksObtained ?? "";
                });
            });
        });

        setMarksState(initial);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // HANDLE INPUT CHANGE
    const handleChange = (studentId, taskId, value) => {
        setMarksState(prev => ({
            ...prev,
            [`${studentId}-${taskId}`]: value
        }));
    };

    // SAVE ALL MARKS (TASK LEVEL)
    const handleSave = async () => {
        if (!data) return;

        const requests = [];

        data.students.forEach(student => {
            student.assessments.forEach(assessment => {
                assessment.tasks.forEach(task => {

                    const payload = {
                        studentId: student.studentId,
                        taskId: task.taskId,
                        marksObtained: Number(
                            marksState[`${student.studentId}-${task.taskId}`] || 0
                        )
                    };

                    requests.push(
                        axios.post("http://localhost:5000/marks/single", payload)
                    );
                });
            });
        });

        await Promise.all(requests);

        alert("Marks saved!");
        fetchData();
    };

    if (!data) return <p>Loading...</p>;

    // Calculate tassk points
    const getTaskPoints = (mark, total, weight) => {
        if (!mark || !total) return 0;
        return (mark / total) * weight;
    };

    // Calculate assessment score
    const getAssessmentScore = (student, assessment) => {
        let totalPoints = 0;
        let totalWeight = 0;

        assessment.tasks.forEach(task => {
            const mark = marksState[`${student.studentId}-${task.id}`];

            if (mark !== "" && mark != null) {
                const points =  getTaskPoints(mark, task.totalMarks, task.weight);
                totalPoints += points;
                totalWeight += task.weight;
            }
        });


        if (totalWeight === 0) return "";

        return ((totalPoints / totalWeight) * assessment.weight).toFixed(1);

    };

    // Calculate term score
    const getTermScore = (student) => {
        let total = 0;
        let totalWeight = 0;

        data.assessments.forEach(a => {
            const score = getAssessmentScore(student, a);

            if (score !== "") {
                total += Number(score);
                totalWeight += a.weight;
            }
        });

        if (totalWeight === 0) return "";

        return ((total / totalWeight) * 100).toFixed(1);
    };

    return (
        <div>
            <h2>Marks Grid</h2>

            <table className="content-table">
                <thead>
                    {/* ROW 1 */}
                    <tr>
                        <th rowSpan="3" className="number-col">#</th>
                        <th rowSpan="3">Student</th>
                        <th
                            colSpan={data.assessments.reduce(
                                (sum, a) => sum + a.tasks.length + 1,
                                0
                            )}
                        >
                            {data.term}
                        </th>
                        <th rowSpan="3">Average</th>
                    </tr>

                    {/* ROW 2 */}
                    <tr>
                        {data.assessments.map(a => (
                            <React.Fragment key={a.id}>
                                <th colSpan={a.tasks.length}>
                                    {a.type}
                                </th>
                                <th rowSpan="2">{a.weight}</th>
                            </React.Fragment>
                        ))}
                    </tr>

                    {/* ROW 3 */}
                    <tr>
                        {data.assessments.map(a => (
                            <React.Fragment key={a.id}>
                                {a.tasks.map(task => (
                                    <th key={task.taskId}>
                                        {task.name}
                                    </th>
                                ))}
                            </React.Fragment>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* TASK TOTALS */}
                    <tr className="totals-row">
                        <td className="number-col"></td>
                        <td><strong></strong></td>

                        {data.assessments.map(a => (
                            <React.Fragment key={`total-${a.id}`}>
                                    {a.tasks.map(task => (
                                        <td key={task.id}><strong>{task.totalMarks}</strong></td>
                                    ))}
                                    <td>
                                        {/* {getAssessmentScore(student, assessment)} */}
                                    </td> {/* W column */}
                            </React.Fragment>
                        ))}
                        <td></td>
                    </tr>
                    {/* TASK WIGHTS */}
                    <tr className="points-row">
                        <td className="number-col"></td>
                        <td><strong></strong></td>

                        {data.assessments.map(a => (
                            <React.Fragment key={`weight-${a.id}`}>
                                {a.tasks.map(task => (
                                    <td key={task.id}><strong>{task.weight}</strong></td>
                                ))}
                                <td></td>
                            </React.Fragment>
                        ))}
                        <td></td>
                    </tr>

                    {data.students.map((student, index) => (
                        <tr key={student.studentId}>

                            {/* NUMBER */}
                            <td className="number-col">{index + 1}</td>

                            {/* NAME */}
                            <td>{student.name}</td>

                            {/* TASK INPUTS */}
                            {student.assessments.map(assessment => (
                                <React.Fragment key={assessment.assessmentId}>

                                    {assessment.tasks.map(task => (
                                        <td key={task.taskId}>
                                            <input
                                                type="number"
                                                value={
                                                    marksState[
                                                        `${student.studentId}-${task.taskId}`
                                                    ] || ""
                                                }
                                                onChange={e =>
                                                    handleChange(
                                                        student.studentId,
                                                        task.taskId,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}

                                    {/* WEIGHT PLACEHOLDER */}
                                    <td>{getAssessmentScore(student, assessment)}</td>

                                </React.Fragment>
                            ))}

                            {/* AVERAGE */}
                            <td>{getTermScore(student) !== "" 
                                ? `${getTermScore(student)}%` 
                                : ""}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />
            <button onClick={handleSave}>Save All</button>
        </div>
    );
};

export default MarksGrid;