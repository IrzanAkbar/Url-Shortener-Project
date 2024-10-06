var search = document.getElementById('search');
var suggestionBox = document.getElementById('suggestionBox')

var searchSug = () => {
    var charac = search.value;
    if(charac.length == 0){
        suggestionBox.style.display = "none"
        return
    }
    axios.post('/search',{charac})
        .then(res => {
            suggestionBox.innerHTML = '';
            console.log(suggestionBox)
            if(res.data.length > 0){
                suggestionBox.style.display = "block";
                res.data.forEach(pro => {
                    var suggestionItem = document.createElement('div');
                    
                    suggestionItem.textContent = pro.title;
                    suggestionBox.appendChild(suggestionItem)

                    suggestionItem.onclick = () => {
                        search.value = pro.title;
                        suggestionBox.style.display = "none"
                    }
                })
            } else{
                suggestionBox.style.display = "none"
            }
        })
    
}

var tableId = document.getElementById('tableId')
var closeBtn = document.getElementById('closeBtn');

var getSearchItem = () => {
    var title = search.value;
    axios.get(`/url/getSearchItem/${title}`)
        .then(res => {
            if(res.data[0].title){
                closeBtn.style.display = "block"
                tableId.innerHTML = `
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Full URL</th>
                            <th>Short URL</th>
                            <th>Added Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${res.data[0].title}</td>
                            <td><a style="color:blue;" href="${res.data[0].fullurl}">${res.data[0].fullurl}</a></td>
                            <td><a style="color:blue;" href="${res.data[0].shorturl}">${res.data[0].shorturl}</a></td>
                            <td>${res.data[0].addedtime}</td>

                        </tr>
                    </tbody>


                `
            }
        })

}





search.addEventListener('input',searchSug)