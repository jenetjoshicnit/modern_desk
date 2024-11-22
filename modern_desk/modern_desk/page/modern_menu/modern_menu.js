frappe.pages['modern-menu'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Menu',
		single_column: true
	});


	console.log(wrapper,'wrapperrrrrrr')

	if (!wrapper.rendered) {
		// fetch_workspaces(page); 
		frappe.modern_menu.make(page);

		wrapper.rendered = true;
	}
}
function fetch_workspaces(page) {
    frappe.call({
        method: "frappe.desk.desktop.get_workspace_sidebar_items",
        callback: function (response) {
            console.log(response, 'response');
            if (response && response.message) {
                frappe.workspaces = response.message.pages;
                frappe.modern_menu.make(page);
            } else {
                console.error("Failed to fetch workspaces or data format is incorrect");
            }
        },
        error: function (err) {
            console.log("Error:", err);
        }
    });
}

frappe.modern_menu = {
	make(page) {
		let all_pages = frappe.workspaces;

		console.log("Rendering menu with pages:", all_pages);

		if (!all_pages) {
			console.error("No workspace data available for rendering.");
			return;
		}

		let body = ``;
		body += `<div id="modern-menu" class="widget-group">
				<div class="widget-group-head">
					<div class="widget-group-title"></div>
				</div>
				<div class="widget-group-body grid-col-3">
		`;


		let dummies = Object.values(all_pages)
			.filter((page) => (page.parent_page == ""))

		let iconArray = [
			"https://cnit-solutions.com/cdn/house.png",
			"https://cnit-solutions.com/cdn/accounting.png",
			"https://cnit-solutions.com/cdn/buying-decision.png",
			"https://cnit-solutions.com/cdn/loan.png",
			"https://cnit-solutions.com/cdn/in-stock.png",
			"https://cnit-solutions.com/cdn/digital-asset-management.png",
			"https://cnit-solutions.com/cdn/power-plant.png",
			"https://cnit-solutions.com/cdn/shield.png",
			"https://cnit-solutions.com/cdn/project-management.png",
			"https://cnit-solutions.com/cdn/support.png",
			"https://cnit-solutions.com/cdn/team.png",
			"https://cnit-solutions.com/cdn/website.png",
			"https://cnit-solutions.com/cdn/management.png",
			"https://cnit-solutions.com/cdn/tools.png",
			"https://cnit-solutions.com/cdn/build.png",
			"https://cnit-solutions.com/cdn/platform.png",
			"https://cnit-solutions.com/cdn/build.png",
			"https://cnit-solutions.com/cdn/build.png",

		];

		dummies.forEach((item, index) => {
			if (iconArray[index]) {  // Check if iconArray has a value at this index
				item.icon = iconArray[index];
			}
		});

		Object.values(all_pages)
			.filter((page) => (page.parent_page == "") &&
			!["ERPNext Integrations", "ERPNext Settings", "Build"].includes(page.label)
			)
			.forEach((item) => {
				let page_url = `/app/${item.public ? frappe.router.slug(item.title) : "private/" + frappe.router.slug(item.title)}`;
				console.log("Generated URL:", page_url); // Log the generated URL

				body += `
					<div class="widget-head">
					<div class="card-menu-page">
						<a style="font-size: 16px;" 
						href="/app/${item.public
						? frappe.router.slug(item.title)
						: "private/" + frappe.router.slug(item.title)
					}" >
							<div class="card-icon-menu">
								<img src=${item.icon} />
							</div>
							<div class="card-title-menu">${__(item.title)}</div>
						</a>
						</div>
					</div>


				

					`;
			})
		body += `</div></div>`


		$(page.main).empty().append(body);

		// Append it to the page
		// $(frappe.render_template(body, this)).appendTo(page.main);
	}
}