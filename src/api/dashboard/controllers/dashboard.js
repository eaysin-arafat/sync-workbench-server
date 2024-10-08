"use strict";

/**
 * A set of functions called "actions" for `dashboard`
 */

module.exports = {
  dashboardAction: async (ctx, next) => {
    try {
      // Helper function to get the count from a model
      const getCount = async (model, filters = {}) => {
        return strapi.db.query(model).count({ where: filters });
      };

      const formatDate = (date) => new Date(date).toISOString().split("T")[0];

      const startDate = formatDate(new Date());
      const endDate = formatDate(
        new Date(new Date().setDate(new Date().getDate() + 30))
      );

      // Function to check if a user's birthday is upcoming (within next 30 days)
      const getUpcomingBirthdays = async () => {
        return strapi.db.query("plugin::users-permissions.user").findMany({
          where: {
            is_employee: true,
            date_of_birth: {
              $gte: startDate,
              $lte: endDate,
            },
          },
          select: ["username", "email", "date_of_birth"],
          populate: {
            avatar: true,
          },
        });
      };

      const [
        totalEmployees,
        pendingEmployees,
        pendingLeaves,
        departmentsCount,
        totalProjects,
        totalTasks,
        completedTasks,
        ongoingTasks,
        totalSkills,
        totalCertifications,
        recentPerformanceReviews,
        recentPayrolls,
        upcomingBirthdays,
      ] = await Promise.all([
        getCount("api::employee.employee"),
        getCount("api::employee.employee", { employee_status: "4" }),
        getCount("api::leave.leave", { status: "Pending" }),
        getCount("api::department.department"),
        getCount("api::project.project"),
        getCount("api::task.task"),
        getCount("api::task.task", { status: "Completed" }),
        getCount("api::task.task", { status: "In Progress" }),
        getCount("api::skill.skill"),
        getCount("api::certification.certification"),
        strapi.db.query("api::performance-review.performance-review").findMany({
          where: {
            review_date: {
              $gte: startDate,
            },
          },
        }),
        strapi.db.query("api::payroll.payroll").findMany({
          where: {
            salary_date: {
              $gte: startDate,
            },
          },
        }),
        getUpcomingBirthdays(),
      ]);

      // Format recent performance reviews and payroll records
      const recentPerformanceReviewsData =
        recentPerformanceReviews && recentPerformanceReviews.length
          ? recentPerformanceReviews.map((review) => ({
              employee: review.employee_id,
              review_date: formatDate(review.review_date),
              overall_rating: review.overall_rating,
              comments: review.comments,
            }))
          : [];

      const recentPayrollsData =
        recentPayrolls && recentPayrolls.length
          ? recentPayrolls.map((payroll) => ({
              employee: payroll.employee_id,
              salary_date: formatDate(payroll.salary_date),
              gross_salary: payroll.gross_salary,
              net_salary: payroll.net_salary,
            }))
          : [];

      // Format upcoming birthdays data
      const upcomingBirthdaysData =
        upcomingBirthdays && upcomingBirthdays.length
          ? upcomingBirthdays.map((user) => ({
              username: user.username,
              email: user.email,
              date_of_birth: formatDate(user.date_of_birth),
              avatar: user.avatar ? user.avatar.url : null,
            }))
          : [];

      // Structure the response
      ctx.body = {
        success: true,
        data: {
          totalEmployees: totalEmployees || 0,
          pendingEmployees: pendingEmployees || 0,
          pendingLeaves: pendingLeaves || 0,
          departmentsCount: departmentsCount || 0,
          totalProjects: totalProjects || 0,
          totalTasks: totalTasks || 0,
          completedTasks: completedTasks || 0,
          ongoingTasks: ongoingTasks || 0,
          totalSkills: totalSkills || 0,
          totalCertifications: totalCertifications || 0,
          recentPerformanceReviews: recentPerformanceReviewsData,
          recentPayrolls: recentPayrollsData,
          upcomingBirthdays: upcomingBirthdaysData,
        },
      };
    } catch (err) {
      ctx.body = {
        success: false,
        message: "An error occurred while fetching dashboard data.",
        error: err.message,
      };
      console.error("Dashboard Error:", err);
    }
  },
};
