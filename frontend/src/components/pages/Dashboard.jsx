import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { dashboardService } from "../../services/dashboard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    employees: 0,
    chefs: 0,
    usersWithTeam: 0,
    teamsAndTheirProjects: [],
    teams: 0,
    projects: 0,
    projectsNotStarted: 0,
    projectsInProgress: 0,
    projectsFinished: 0,
    tasks: 0,
    tasksNotStarted: 0,
    tasksInProgress: 0,
    tasksFinished: 0,
    projectsWithWorkedTime: [],
  });
  // Composant de carte générique
  const StatCard = ({ title, value }) => {
    // Inline styles for the card
    const cardStyle = {
      border: "1px solid #ccc",
      borderRadius: "8px",
      borderColor: "#0C0C0C",
      boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#F7C566", // Ajout de la couleur de fond
    };

    return (
      <div className="card" style={cardStyle}>
        <div className="card-body">
          <h5 className="card-title text-center">{title}</h5>
          <p className="card-text text-center">{value}</p>
        </div>
      </div>
    );
  };
  const [selectedProject, setSelectedProject] = useState("");
  const handleProjectSelect = (projectId) => {
    setSelectedProject(projectId);
  };
  var optionsBarVertical = {
    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#000",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: ["#FF8C00", "#00688B", "#006400", "#4B0082", "#B8860B", "#8B0000"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        distributed: true,
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: true,
    },

    legend: {
      show: true,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: [
        "Utilisateurs",
        "Employés",
        "Chefs",
        "Équipes",
        "Projets",
        "Tâches",
      ],
    },
    yaxis: {
      show: true,
      min: 0,
      max:
        Math.max(
          stats.users,
          stats.employees,
          stats.chefs,
          stats.teams,
          stats.projects,
          stats.tasks
        ) || 1000, // You can adjust the default maximum value as needed
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  };
  const maxTimeSpent = selectedProject
    ? Math.max(
        ...stats.projectsWithWorkedTime
          .find((project) => project._id === selectedProject)
          .tasks.map((task) => task.timeSpent)
      )
    : 0;
  const maxEstimatedTime = selectedProject
    ? Math.max(
        ...stats.projectsWithWorkedTime
          .find((project) => project._id === selectedProject)
          .tasks.map((task) => task.estimatedTime)
      )
    : 0;
  const maxYAxis = Math.max(maxTimeSpent, maxEstimatedTime) || 1000;
  const selectedProjectData = selectedProject
    ? stats.projectsWithWorkedTime.find(
        (project) => project._id === selectedProject
      )
    : null;

  var optionsBarVerticalTasksTime = {
    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#000",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: ["#F97300", "#0C0C0C"],
    // ["#5D87FF", "#49BEFF"]
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: true,
    },

    legend: {
      show: true,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: selectedProject
        ? stats.projectsWithWorkedTime
            .find((project) => project._id === selectedProject)
            .tasks.map((task) => task.nameTask)
        : [],
    },
    yaxis: {
      show: true,
      min: 0,
      max: maxYAxis, // You can adjust the default maximum value as needed
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
    series: selectedProject
      ? [
          {
            name: "Temps passé (heures)",
            data: selectedProjectData.tasks.map((task) => task.timeSpent),
          },
          {
            name: "Temps estimé (heures)",
            data: selectedProjectData.tasks.map((task) => task.estimatedTime),
          },
        ]
      : [],
  };
  var optionsBarHorizontalProjectsPerTeam = {
    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#000",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: ["#0C0C0C", "#B8860B", "#FF6500", "#FFC55A", "#FFBB70", "#8B0000"],
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "45%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        distributed: true,
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: true,
    },

    legend: {
      show: true,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: stats.teamsAndTheirProjects.map((team) => team.teamName),
    },
    yaxis: {
      show: true,
      min: 0,
      max:
        Math.max(
          ...stats.teamsAndTheirProjects.map((team) => team.projects.length)
        ) || 1000, // You can adjust the default maximum value as needed
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
    series: stats.teamsAndTheirProjects
      ? [
          {
            name: "Projets",
            data: stats.teamsAndTheirProjects.map(
              (team) => team.projects.length
            ),
          },
        ]
      : [{ data: stats.teamsAndTheirProjects.map(() => 0) }],
  };
  var optionsBarHorizontalEmployeesPerTeam = {
    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#000",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },
    colors: ["#0C0C0C", "#B8860B", "#FF6500", "#FFC55A", "#FFBB70", "#8B0000"],
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "45%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        distributed: true,
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: true,
    },

    legend: {
      show: true,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      categories: stats.teamsAndTheirProjects.map((team) => team.teamName),
    },
    yaxis: {
      show: true,
      min: 0,
      max:
        Math.max(
          ...stats.teamsAndTheirProjects.map((team) => team.employees.length)
        ) || 1000, // You can adjust the default maximum value as needed
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
    series: stats.teamsAndTheirProjects
      ? [
          {
            name: "Employés",
            data: stats.teamsAndTheirProjects.map(
              (team) => team.employees.length
            ),
          },
        ]
      : [{ data: stats.teamsAndTheirProjects.map(() => 0) }],
  };

  var donutOptionsProjects = {
    chart: {
      width: "100%",
      type: "Pie",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.floor(val) + "%";
      },
      dropShadow: {},
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    colors: ["#FFC55A", "#F97300", "#0C0C0C"],
    labels: ["En attente", "En cours", "Terminé"],
    series: stats
      ? [
          stats.projectsNotStarted,
          stats.projectsInProgress,
          stats.projectsFinished,
        ]
      : [0, 0, 0],
  };

  var donutOptionsTasks = {
    chart: {
      width: "100%",
      type: "donut",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.floor(val) + "%";
      },
      dropShadow: {},
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    legend: {
      position: "right",
      offsetY: 0,
      height: 230,
    },
    colors: ["#FFC55A", "#F97300", "#0C0C0C"],
    labels: ["En attente", "En cours", "Terminé"],
    series: stats
      ? [stats.tasksNotStarted, stats.tasksInProgress, stats.tasksFinished]
      : [0, 0, 0],
  };

  var series = stats
    ? [
        {
          data: [
            stats.users || 0,
            stats.employees || 0,
            stats.chefs || 0,
            stats.teams || 0,
            stats.projects || 0,
            stats.tasks || 0,
          ],
        },
      ]
    : [{ data: [0, 0, 0, 0, 0, 0] }];
  useEffect(() => {
    const fetchStats = async () => {
      const response = await dashboardService.stats();
      setStats(response.data);
      if (response.data.projectsWithWorkedTime.length > 0) {
        setSelectedProject(response.data.projectsWithWorkedTime[0]._id);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container-fluid">
      {localStorage.getItem("role") === "employe" ? (
        <div
          className="d-flex justi-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <h1>Vous n'êtes pas autorisé à voir cette page</h1>{" "}
        </div>
      ) : (
        <div className="row">
          {/* <div className="col-lg-12">
            <div className="card overflow-hidden p-1 ">
              <div className="card-body p-1"> */}
          {/* <h5 className="card-title mb-9 fw-semibold">Nombre total</h5> */}
          <div class="row">
            {/* <div class="col-lg-4 mb-1 ">
                    <StatCard
                      title=" Nombre des utilisateurs"
                      value={stats.users}
                    />
                  </div> */}

            <div class="col-lg-4 mb-1  ">
              <StatCard title=" Nombre des employés" value={stats.employees} />
            </div>

            {/* <div class="col-lg-4 mb-1 ">
                    <StatCard title=" Nombre des chefs" value={stats.chefs} />
                  </div> */}
            <div class="col-lg-4 mb-1  ">
              <StatCard title=" Nombre des équipes" value={stats.teams} />
            </div>
            <div class="col-lg-4 mb-1 ">
              <StatCard title="Nombre des projets" value={stats.projects} />
            </div>
          </div>

          {/* <div class="col-lg-4 mb-1 ">
                    <StatCard title=" Nombre des Taches" value={stats.tasks} />
                  </div> */}
          {/* </div>
            </div>
          </div> */}
          <div className="col-lg-4">
            <div className="card overflow-hidden p-1">
              <div className="card-body p-1">
                <h5 className="card-title mb-9 fw-semibold">
                  Temps passé sur les projets
                </h5>
                <div className="row align-items-center">
                  <select
                    className="form-select"
                    value={selectedProject}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                  >
                    {stats.projectsWithWorkedTime.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.nameProject}
                      </option>
                    ))}
                  </select>
                  {selectedProject && (
                    <Chart
                      options={optionsBarVerticalTasksTime}
                      series={optionsBarVerticalTasksTime.series}
                      type="bar"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card overflow-hidden p-1">
              <div className="card-body p-1">
                <h5 className="card-title mb-9 fw-semibold">Projets</h5>
                <div className="row align-items-center">
                  {stats && (
                    <Chart
                      options={donutOptionsProjects}
                      series={donutOptionsProjects.series}
                      type="donut"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card overflow-hidden p-1">
              <div className="card-body p-1">
                <h5 className="card-title mb-9 fw-semibold">Tâches</h5>
                <div className="row align-items-center">
                  {stats && (
                    <Chart
                      options={donutOptionsTasks}
                      series={donutOptionsTasks.series}
                      type="pie"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card overflow-hidden p-1">
              <div className="card-body p-1">
                <h5 className="card-title mb-9 fw-semibold">
                  Nombre de projets par équipe
                </h5>
                <div className="row align-items-center">
                  {stats && (
                    <Chart
                      options={optionsBarHorizontalProjectsPerTeam}
                      series={optionsBarHorizontalProjectsPerTeam.series}
                      type="bar"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card overflow-hidden p-1">
              <div className="card-body p-1">
                <h5 className="card-title mb-9 fw-semibold">
                  Nombre d'employés par équipe
                </h5>
                <div className="row align-items-center">
                  {stats && (
                    <Chart
                      options={optionsBarHorizontalEmployeesPerTeam}
                      series={optionsBarHorizontalEmployeesPerTeam.series}
                      type="bar"
                      width="100%"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

{
  /* <div className="col-lg-6 d-flex align-items-strech">
            <div className="card w-100">
              <div className="card-body">
                <div className="d-sm-flex d-block align-items-center justify-content-between mb-9">
                  <div className="mb-3 mb-sm-0">
                    <h5 className="card-title fw-semibold">
                      Statistiques verticales
                    </h5>
                  </div>
                </div>
                {stats && (
                  <Chart
                    options={optionsBarVertical}
                    series={series}
                    type="bar"
                    width="100%"
                  />
                )}
              </div>
            </div>
          </div> */
}
