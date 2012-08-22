Make sure these lines are in the /etc/ejabberd/ejabberd.cfg

    {auth_method, [anonymous]}.
    {anonymous_protocol, login_anon}.

Enable http_bind module

    {modules,
     [
        ...
        {mod_http_bind, []},
        ...
     ]}

Restart ejabberd

    sudo /etc/init.d/ejabberd restart

Try out strophe sample:

    - start nginx
    - try http://localhost:8000/strophejs-1.0.2/examples/basic.html
    - only "localhost" hostname is allowed for the jid.


