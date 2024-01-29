export const create_account = async ({ userId }: { userId: string }) => {
  try {
    const account = `screen_${userId}`;
    const url = new URL("https://next-episode.net/PAGES/misc/signup.php");
    url.searchParams.append("tz", "1");
    url.searchParams.append("reason", "join_next_ep_button");
    url.searchParams.append("allow_contact", "flase");
    url.searchParams.append("username", account);
    url.searchParams.append("pass1", account);
    url.searchParams.append("pass2", account);
    url.searchParams.append("email", `${account}@screentime.com`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Error creating user account");
      return { account_id: null, k_value: null };
    }
    return await get_account_info({ userId });
  } catch (err) {
    console.error("Error creating user account:", err);
    return { account_id: null, k_value: null };
  }
};

export const get_account_info = async ({ userId }: { userId: string }) => {
  const login_info = {
    username: `screen_${userId}`,
    password: `screen_${userId}`,
  };

  const loginResponse = await fetch("https://next-episode.net/userlogin", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(login_info),
  });

  if (!loginResponse.ok) {
    console.error("Login failed");
    return { account_id: null, k_value: null };
  }

  const pageResponse = await fetch("https://next-episode.net/userlogin", {});

  if (!pageResponse.ok) {
    console.error("Failed to fetch user page");
    return { account_id: null, k_value: null };
  }

  const pageText = await pageResponse.text();

  try {
    const account_id = pageText.match(/user_id=(\d*)/)?.[1] || null;
    const k_value = pageText.match(/k=(.{32})/)?.[1] || null;
    return { account_id, k_value };
  } catch (err) {
    console.error("Error parsing page content:", err);
    return { account_id: null, k_value: null };
  }
};

console.log(get_account_info({ userId: "" }));
