def parse_follow(request):
    follow = request.args.get('follow', '')
    return follow.split(',') if follow else []