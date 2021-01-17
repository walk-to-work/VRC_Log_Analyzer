
var file_input = document.getElementById("selfile");


//ダイアログでファイルが選択された時
file_input.addEventListener("change",function(evt){

    var file = evt.target.files;

    //FileReaderの作成
    var reader = new FileReader();
    //テキスト形式で読み込む
    reader.readAsText(file[0]);

    //読込終了後の処理
    reader.onload = function (ev) {
        const loaded_text_data = reader.result
        const splited_sentence = loaded_text_data.split("\n")
        
        let in_room_flag = 0;
        let players_info = [];
        let room_name = ""
        splited_sentence.forEach(element => {
            if ( is_enter_room_log(element) ){
                in_room_flag = true;
                room_name = extract_room_name(element)
            }
            
            if( in_room_flag ){

                // Join Room
                if( is_join_log(element) ){
                    let player_name = extract_join_room_player_name ( element )
                    let join_room_time = get_date_and_time_from_sentence(element)
                    players_info.push( join_room_time + " [入室] " + player_name + "\n")
                }
                
                // Other Player Left Room 
                if( is_other_player_left_log(element) )
                {
                    let player_name = extract_left_room_player_name( element )
                    let left_room_time = get_date_and_time_from_sentence(element)
                    players_info.push( left_room_time + " [退室] " +  player_name + "\n")
                }

                // You Letf Room
                if (is_left_room_log(element)) {
                    in_room_flag = false;

                    document.test.txt.value += "ルーム名：" + room_name +'\n'

                    players_info.forEach( element => {
                        document.test.txt.value += element
                    });

                    document.test.txt.value += "\n"
                    players_info = []
                }


            }

        });

    }
}, false);

function get_date_and_time_from_sentence( sentence ){
    const splited_sentence = sentence.split(" ")
    return splited_sentence[0] + " " + splited_sentence[1]
}

function is_enter_room_log(log){
    return log.match('Entering Room')
}

function is_join_log(log) {
    return log.match('Initialized PlayerAPI')
}

function is_other_player_left_log(log) {
    return log.match('PlayerManager')
}

function is_left_room_log(log){
    return log.match('Successfully left room')
}

function extract_room_name( sentence ){         // "Room:"以降の文字列を返す
    const splited_words = sentence.split(" ")
    const split_criteria = (word) => word == "Room:"
    const split_idx = splited_words.findIndex(split_criteria)
    let room_name = ""

    splited_words.slice(split_idx + 1).forEach(word =>{
        room_name += word + ' '
    });

    return room_name
}

function extract_join_room_player_name(in_room_log) {
    return in_room_log.match(/\"(.+)\"/)[1];    // ダブルクォーテーションに囲まれた部分を抽出
}

function extract_left_room_player_name(left_room_log) {
    const slash_idx = left_room_log.indexOf('/')
    return left_room_log.slice( slash_idx + 2 ) // スラッシュと次の空白以降の文字列を返す
}

